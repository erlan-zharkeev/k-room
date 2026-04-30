import { expect, test, type Page } from '@playwright/test'

import { PASSWORD_RECOVERY_FIXTURE_USER } from './fixtures'

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
  if (await emailInput.count()) {
    await emailInput.fill(email)
  }

  const sendResponsePromise = getRecoverySendResponse(page)
  await page.getByRole('button', { name: 'Send code', exact: true }).click()
  const sendResponse = await sendResponsePromise
  const sendPayload = (await sendResponse.json()) as { payload?: { debugCode?: string } }
  const debugCode = sendPayload.payload?.debugCode

  expect(debugCode).toMatch(/^\d{6}$/)

  await page.getByPlaceholder('Enter code from email').fill(String(debugCode))

  const validateResponsePromise = getRecoveryValidateResponse(page)
  await page.getByRole('button', { name: 'Validate', exact: true }).click()
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
  test('opens as SPA from login and completes full recovery flow', async ({ page }) => {
    const { email, password, nextPassword } = PASSWORD_RECOVERY_FIXTURE_USER

    await recoverPassword({
      page,
      email,
      nextPassword,
      fromLogin: true
    })

    await page.getByRole('link', { name: 'Go to login page', exact: true }).click()
    await expect(page).toHaveURL(/\/authorize\/login$/)

    await page.getByPlaceholder('Enter email or nickname').fill(email)
    await page.getByPlaceholder('Enter your password').fill(nextPassword)
    await page.getByRole('button', { name: 'Login', exact: true }).click()

    await expect(page).toHaveURL(/\/app/)
    await page.getByRole('button', { name: 'Logout' }).click()
    await expect(page).toHaveURL(/\/authorize\/login/)

    await recoverPassword({
      page,
      email,
      nextPassword: password,
      fromLogin: true
    })
  })
})
