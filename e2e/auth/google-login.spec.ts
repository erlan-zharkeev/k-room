import { expect, test } from '@playwright/test'

import { dismissFirstRunOverlays } from 'e2e/shared/app'

test.describe('google login', () => {
  test('signs in through mocked google provider flow', async ({ page }) => {
    await page.goto('/authorize/login')

    await expect(page.getByPlaceholder('Enter email or nickname')).toBeVisible({ timeout: 15_000 })

    const googleButton = page.getByRole('button', { name: 'Login with Google', exact: true })

    await expect(googleButton).toBeVisible({ timeout: 15_000 })
    await googleButton.click()

    await page.waitForURL('**/app/**')
    await dismissFirstRunOverlays(page)
    await expect(page).toHaveURL(/\/app/)
  })
})
