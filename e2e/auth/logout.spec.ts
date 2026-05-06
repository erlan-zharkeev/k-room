import { expect, test, type Page } from '@playwright/test'

import { getAppDbName, readStores, seedStores } from 'e2e/shared/indexed-db'

import { LOGIN_FIXTURE_USER } from './fixtures'

const AUTH_COOKIE_NAMES = ['jwt', 'refresh-jwt', 'device-id'] as const
const RESET_STORE_NAMES = ['contacts', 'media', 'chat-rooms', 'info-notifications'] as const

const login = async (page: Page) => {
  await page.goto('/authorize/login')

  const loginInput = page.getByPlaceholder('Enter email or nickname')
  const passwordInput = page.getByPlaceholder('Enter your password')
  const submitButton = page.getByRole('button', { name: 'Login', exact: true })

  await loginInput.click()
  await loginInput.pressSequentially(LOGIN_FIXTURE_USER.email)
  await loginInput.blur()

  await passwordInput.click()
  await passwordInput.pressSequentially(LOGIN_FIXTURE_USER.password)
  await passwordInput.blur()

  await expect(submitButton).toBeEnabled()
  await submitButton.click()
  await page.waitForURL('**/app/**')
}

test.describe('logout', () => {
  test('clears auth cookies and client session data', async ({ page }) => {
    await login(page)

    const logoutButton = page.locator('.main-top-bar__actions button')
    const dbName = await getAppDbName(page)
    const seededItems = RESET_STORE_NAMES.map((storeName) => ({
      storeName,
      id: `logout-e2e-${storeName}`
    }))

    await expect(logoutButton).toBeVisible()
    await expect(page.locator('.main-top-bar')).toContainText('@erlan')

    await seedStores(page, dbName, seededItems)

    const seededStores = await readStores(page, dbName, RESET_STORE_NAMES)

    seededItems.forEach(({ storeName, id }) => {
      expect(seededStores[storeName]).toEqual(expect.arrayContaining([expect.objectContaining({ id })]))
    })

    await logoutButton.click()

    await page.waitForURL('**/authorize/login')
    await expect(page.getByRole('link', { name: 'Login' })).toBeVisible()
    await expect
      .poll(async () => {
        const cookieNames = new Set((await page.context().cookies()).map(({ name }) => name))

        return AUTH_COOKIE_NAMES.every((cookieName) => !cookieNames.has(cookieName))
      })
      .toBe(true)

    const storesAfterLogout = await readStores(page, dbName, RESET_STORE_NAMES)

    seededItems.forEach(({ storeName, id }) => {
      expect(storesAfterLogout[storeName].find((item) => item.id === id)).toBeUndefined()
    })
  })
})
