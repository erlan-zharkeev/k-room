import { expect, test } from '@playwright/test'

import { buildGoogleFixtureUser } from './fixtures'

test.describe('google login', () => {
  test('signs in through mocked google provider flow', async ({ page }) => {
    const user = buildGoogleFixtureUser()

    await page.addInitScript((payload) => {
      window.__E2E_FIREBASE_AUTH_RESULT__ = payload
    }, user)

    await page.goto('/login')

    const googleButton = page.getByRole('button', { name: 'Login with Google', exact: true })

    await expect(googleButton).toBeVisible()
    await googleButton.click()

    await page.waitForURL('**/app')
    await expect(page).toHaveURL(/\/app$/)
  })
})
