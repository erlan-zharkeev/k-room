import { expect, test } from '@playwright/test'

test.describe('google login', () => {
  test('signs in through mocked google provider flow', async ({ page }) => {
    await page.goto('/authorize/login')

    const googleButton = page.getByRole('button', { name: 'Login with Google', exact: true })

    await expect(googleButton).toBeVisible()
    await googleButton.click()

    await page.waitForURL('**/app/**')
    await expect(page).toHaveURL(/\/app/)
  })
})
