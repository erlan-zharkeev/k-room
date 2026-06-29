import { expect, test, type Page } from '@playwright/test'

import { loginByCredentials } from 'e2e/shared/auth'
import { createConfirmedAppUserWithFixturePassword } from 'e2e/shared/user'

import { buildPasswordRecoveryFixtureUser } from './lib'

const PASSWORD_RECOVERY_TEST_TIMEOUT_MS = 90_000

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

  const code = String(debugCode)
  const firstCodeInput = page.getByRole('textbox', { name: 'OTP 1' })

  await expect(firstCodeInput).toBeVisible()
  await expect(firstCodeInput).toBeEnabled()
  await firstCodeInput.click()
  await firstCodeInput.pressSequentially(code, { delay: 20 })
  await Promise.all(
    [...code].map((digit, index) => expect(page.getByRole('textbox', { name: `OTP ${index + 1}` })).toHaveValue(digit))
  )
  await firstCodeInput.blur()

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

  test('opens as SPA from login and completes full recovery flow', async ({ page }) => {
    const { nickname, email, password } = buildPasswordRecoveryFixtureUser()

    await createConfirmedAppUserWithFixturePassword({ nickname, email })

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
