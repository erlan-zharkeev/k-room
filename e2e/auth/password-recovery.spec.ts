import { expect, test, type APIRequestContext, type Page } from '@playwright/test'

import { E2E_ENV } from 'e2e/config'
import { loginByCredentials } from 'e2e/shared/auth'

import { buildPasswordRecoveryFixtureUser } from './lib'

const PASSWORD_RECOVERY_TEST_TIMEOUT_MS = 90_000

const createConfirmedProviderUser = async (request: APIRequestContext, nickname: string, email: string) => {
  const response = await request.post(`${E2E_ENV.PLAYWRIGHT_API_URL}/auth/provider-login`, {
    data: {
      nickname,
      email,
      provider: 'google'
    }
  })

  expect(response.ok()).toBeTruthy()
}

const getRecoverySendResponse = (page: Page) =>
  page.waitForResponse(
    (response) => response.url().includes('/codes/email/password-recovery') && response.request().method() === 'POST'
  )

const getRecoveryValidateResponse = (page: Page) =>
  page.waitForResponse(
    (response) =>
      response.url().includes('/codes/email/validate-email-code-password-recovery') &&
      response.request().method() === 'POST'
  )

const recoverPassword = async ({
  page,
  email,
  nextPassword,
  fromLogin
}: {
  page: Page
  email: string
  nextPassword: string
  fromLogin?: boolean
}) => {
  if (fromLogin) {
    await page.goto('/authorize/login')
    await page.getByRole('link', { name: 'Forgot password?', exact: true }).click()
  } else {
    await page.goto(`/page/password-recovery?user-email=${encodeURIComponent(email)}`)
  }

  await expect(page).toHaveURL(/\/password-recovery/)

  const emailInput = page.getByPlaceholder('Enter your email')
  await expect(emailInput).toBeVisible()
  await emailInput.fill(email)

  const sendResponsePromise = getRecoverySendResponse(page)
  const sendCodeButton = page.getByRole('button', { name: 'Send code', exact: true })

  await expect(sendCodeButton).toBeEnabled()
  await sendCodeButton.click()
  const sendResponse = await sendResponsePromise
  const sendPayload = (await sendResponse.json()) as { payload?: { debugCode?: string } }
  const debugCode = sendPayload.payload?.debugCode

  expect(debugCode).toMatch(/^\d{6}$/)

  const codeInput = page.getByPlaceholder('Enter code from email')

  await expect(codeInput).toBeVisible()
  await expect(codeInput).toBeEnabled()
  await codeInput.click()
  await codeInput.pressSequentially(String(debugCode), { delay: 20 })
  await expect(codeInput).toHaveValue(String(debugCode))
  await codeInput.blur()

  const validateButton = page.getByRole('button', { name: 'Validate', exact: true })

  await expect(validateButton).toBeEnabled()
  const validateResponsePromise = getRecoveryValidateResponse(page)
  await validateButton.click()
  await validateResponsePromise

  await expect(page).toHaveURL(/\/create-new-password\?password-recovery=/)

  const passwordInput = page.getByPlaceholder('Password', { exact: true })
  const confirmPasswordInput = page.getByPlaceholder('Confirm password')

  await passwordInput.fill(nextPassword)
  await confirmPasswordInput.fill(nextPassword)
  await page.getByRole('button', { name: 'Change password', exact: true }).click()

  await expect(page.getByText('Password changed successfully')).toBeVisible()
}

test.describe('password recovery', () => {
  test.setTimeout(PASSWORD_RECOVERY_TEST_TIMEOUT_MS)

  test('opens as SPA from login and completes full recovery flow', async ({ page, request }) => {
    const { nickname, email, password } = buildPasswordRecoveryFixtureUser()

    await createConfirmedProviderUser(request, nickname, email)

    await recoverPassword({
      page,
      email,
      nextPassword: password,
      fromLogin: true
    })

    await page.getByRole('button', { name: 'Go to login page', exact: true }).click()
    await expect(page).toHaveURL(/\/authorize\/login$/)

    await loginByCredentials(page, email, password)
    await expect(page).toHaveURL(/\/app/)
  })
})
