import { expect, test, type Page } from '@playwright/test'

import { SETTINGS_FIXTURE_USER } from './fixtures'

const waitForUserDataUpdateResponse = (page: Page) =>
  page.waitForResponse((response) => response.url().includes('/users/me') && response.request().method() === 'PATCH')

const waitForChangePasswordResponse = (page: Page) =>
  page.waitForResponse(
    (response) => response.url().includes('/users/me/password') && response.request().method() === 'PATCH'
  )

const buildNextNickname = () => `pw-guest-${Date.now().toString(36)}`

const attemptLogin = async (page: Page, login: string, password: string) => {
  await page.goto('/authorize/login')

  await page.getByPlaceholder('Enter email or nickname').fill(login)
  await page.getByPlaceholder('Enter your password').fill(password)
  await page.getByRole('button', { name: 'Login', exact: true }).click()

  try {
    await page.waitForURL('**/app/**', { timeout: 5_000 })

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
  if (!page.url().includes('/app')) return

  await page.getByRole('button', { name: 'Logout' }).click()
  await page.waitForURL('**/authorize/login')
}

const openAccountSettings = async (page: Page) => {
  await page.goto('/app/settings/account')
  await expect(page).toHaveURL(/\/app\/settings\/account/)
}

const updateNickname = async (page: Page, nickname: string) => {
  const responsePromise = waitForUserDataUpdateResponse(page)

  await page.locator('input[autocomplete="nickname"]').fill(nickname)
  await page.getByRole('button', { name: 'Update', exact: true }).click()

  const response = await responsePromise

  expect(response.ok()).toBeTruthy()
  await expect(page.locator('input[autocomplete="nickname"]')).toHaveValue(nickname)
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
  test('updates personal data nickname', async ({ page }) => {
    const nextNickname = buildNextNickname()

    await ensureOriginalPassword(page)

    try {
      await openAccountSettings(page)
      await updateNickname(page, nextNickname)

      await expect(page.locator('.main-top-bar')).toContainText(`@${nextNickname}`)

      await page.reload()

      await expect(page.locator('input[autocomplete="nickname"]')).toHaveValue(nextNickname)
      await expect(page.locator('.main-top-bar')).toContainText(`@${nextNickname}`)
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
})
