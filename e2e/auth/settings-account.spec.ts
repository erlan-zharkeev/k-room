import { expect, test, type Page } from '@playwright/test'

import { dismissFirstRunOverlays, logoutFromApp } from 'e2e/shared/app'
import { loginByCredentials, signInWithProvider } from 'e2e/shared/auth'

import { SETTINGS_FIXTURE_USER } from './constants'

const SETTINGS_ACCOUNT_TEST_TIMEOUT_MS = 90_000

const waitForUserDataUpdateResponse = (page: Page) =>
  page.waitForResponse((response) => response.url().includes('/users/me') && response.request().method() === 'PATCH')

const waitForChangePasswordResponse = (page: Page) =>
  page.waitForResponse(
    (response) => response.url().includes('/users/me/password') && response.request().method() === 'PATCH'
  )

const waitForSendChangeEmailCodeResponse = (page: Page) =>
  page.waitForResponse(
    (response) => response.url().includes('/codes/email/change-email') && response.request().method() === 'POST'
  )

const waitForValidateChangeEmailCodeResponse = (page: Page) =>
  page.waitForResponse(
    (response) =>
      response.url().includes('/codes/email/validate-change-email') && response.request().method() === 'POST'
  )

const buildNextNickname = () => `pw-guest-${Date.now().toString(36)}`
const buildEmailChangeUser = () => {
  const suffix = Date.now().toString(36)

  return {
    nickname: `pw-email-${suffix}`,
    email: `pw-email-${suffix}@example.com`,
    nextEmail: `pw-email-next-${suffix}@example.com`
  }
}

const attemptLogin = async (page: Page, login: string, password: string) => {
  try {
    await loginByCredentials(page, login, password, 5_000)

    return true
  } catch (error) {
    void error

    return false
  }
}

const loginWithKnownPassword = async (page: Page, login: string, passwords: string[]) => {
  await logout(page)

  for (const password of passwords) {
    if (await attemptLogin(page, login, password)) {
      return password
    }
  }

  throw new Error(`Failed to login as ${login}`)
}

const logout = async (page: Page) => {
  await logoutFromApp(page)
}

const openAccountSettings = async (page: Page) => {
  await page.goto('/app/settings/account')
  await expect(page).toHaveURL(/\/app\/settings\/account/)
  await dismissFirstRunOverlays(page)
}

const updateNickname = async (page: Page, nickname: string) => {
  const responsePromise = waitForUserDataUpdateResponse(page)
  const nicknameInput = page.getByRole('textbox', { name: 'Nickname', exact: true })

  await dismissFirstRunOverlays(page)
  await nicknameInput.fill(nickname)
  await page.getByRole('button', { name: 'Update', exact: true }).click()

  const response = await responsePromise

  expect(response.ok()).toBeTruthy()
  await expect(nicknameInput).toHaveValue(nickname)
}

const changeEmail = async (page: Page, currentEmail: string, nextEmail: string) => {
  const changeEmailCard = page.locator('.settings-card').filter({
    has: page.getByRole('heading', { name: 'Change email', exact: true })
  })
  const sendCodeButton = changeEmailCard.getByRole('button', { name: 'Send code', exact: true })
  const validateCodeButton = changeEmailCard.getByRole('button', { name: 'Validate code', exact: true })

  await expect(changeEmailCard.getByText(currentEmail, { exact: true })).toBeVisible()
  await changeEmailCard.locator('input[autocomplete="email"]').fill(nextEmail)
  await expect(sendCodeButton).toBeEnabled()

  const sendResponsePromise = waitForSendChangeEmailCodeResponse(page)
  await sendCodeButton.click()
  const sendResponse = await sendResponsePromise
  const sendPayload = await sendResponse.json()
  const debugCode = sendPayload.payload?.debugCode

  expect(sendResponse.ok()).toBeTruthy()
  expect(debugCode).toMatch(/^\d{6}$/)

  const codeField = changeEmailCard.locator('.settings-change-email-card__field').filter({
    hasText: 'Code from email'
  })

  await codeField.locator('input:not([type="hidden"])').first().pressSequentially(String(debugCode))
  await expect(validateCodeButton).toBeEnabled()

  const validateResponsePromise = waitForValidateChangeEmailCodeResponse(page)
  await validateCodeButton.click()
  const validateResponse = await validateResponsePromise

  expect(validateResponse.ok()).toBeTruthy()
  await expect(changeEmailCard.getByText(nextEmail, { exact: true })).toBeVisible()
  await expect(changeEmailCard.locator('input[autocomplete="email"]')).toHaveValue('')
}

const changePassword = async (page: Page, currentPassword: string, nextPassword: string) => {
  const changePasswordButton = page.getByRole('button', { name: 'Change password', exact: true })
  const responsePromise = waitForChangePasswordResponse(page)

  await page.getByLabel('Current password').fill(currentPassword)
  await page.getByLabel('New password').fill(nextPassword)
  await page.getByLabel('Confirm password').fill(nextPassword)
  await expect(changePasswordButton).toBeEnabled()
  await changePasswordButton.click()

  const response = await responsePromise

  expect(response.ok()).toBeTruthy()
  await expect(page.getByText('Password changed successfully')).toBeVisible()
}

const ensureOriginalPassword = async (page: Page) => {
  const usedPassword = await loginWithKnownPassword(page, SETTINGS_FIXTURE_USER.email, [
    SETTINGS_FIXTURE_USER.password,
    SETTINGS_FIXTURE_USER.nextPassword
  ])

  if (usedPassword === SETTINGS_FIXTURE_USER.password) {
    return
  }

  await openAccountSettings(page)
  await changePassword(page, SETTINGS_FIXTURE_USER.nextPassword, SETTINGS_FIXTURE_USER.password)
  await logout(page)

  const restoredPassword = await loginWithKnownPassword(page, SETTINGS_FIXTURE_USER.email, [
    SETTINGS_FIXTURE_USER.password
  ])

  expect(restoredPassword).toBe(SETTINGS_FIXTURE_USER.password)
}

test.describe('settings account', () => {
  test.setTimeout(SETTINGS_ACCOUNT_TEST_TIMEOUT_MS)

  test('updates personal data nickname', async ({ page }) => {
    const nextNickname = buildNextNickname()

    await ensureOriginalPassword(page)

    try {
      await openAccountSettings(page)
      await updateNickname(page, nextNickname)

      await expect(page.locator('.top-bar')).toContainText(nextNickname)

      await page.reload()

      await expect(page.getByRole('textbox', { name: 'Nickname', exact: true })).toHaveValue(nextNickname)
      await expect(page.locator('.top-bar')).toContainText(nextNickname)
    } finally {
      await openAccountSettings(page)
      await updateNickname(page, SETTINGS_FIXTURE_USER.nickname)
    }
  })

  test('changes password', async ({ page }) => {
    await ensureOriginalPassword(page)

    try {
      await openAccountSettings(page)
      await changePassword(page, SETTINGS_FIXTURE_USER.password, SETTINGS_FIXTURE_USER.nextPassword)
      await logout(page)

      const usedPassword = await loginWithKnownPassword(page, SETTINGS_FIXTURE_USER.email, [
        SETTINGS_FIXTURE_USER.nextPassword
      ])

      expect(usedPassword).toBe(SETTINGS_FIXTURE_USER.nextPassword)
    } finally {
      await ensureOriginalPassword(page)
    }
  })

  test('changes email with email code', async ({ page }) => {
    const { nickname, email, nextEmail } = buildEmailChangeUser()

    await signInWithProvider(page, nickname, email)
    await openAccountSettings(page)
    await changeEmail(page, email, nextEmail)
    await logout(page)
    await signInWithProvider(page, nickname, nextEmail)
    await openAccountSettings(page)

    await expect(
      page.locator('.settings-card').filter({ hasText: 'Change email' }).getByText(nextEmail, { exact: true })
    ).toBeVisible()
  })
})
