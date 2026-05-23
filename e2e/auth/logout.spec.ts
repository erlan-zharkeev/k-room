import { expect, test } from '@playwright/test'

import { loginByCredentials } from 'e2e/shared/auth'
import { getAppDbName, readStores, seedStores } from 'e2e/shared/indexed-db'

import { LOGIN_FIXTURE_USER } from './fixtures'

const AUTH_COOKIE_NAMES = ['jwt', 'refresh-jwt', 'device-id'] as const
const RESET_STORE_NAMES = ['contacts', 'media', 'chat-rooms'] as const

test.describe('logout', () => {
  test('clears auth cookies and client session data', async ({ page }) => {
    await loginByCredentials(page, LOGIN_FIXTURE_USER.email, LOGIN_FIXTURE_USER.password)

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
