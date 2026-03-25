import { expect, test } from '@playwright/test'

import { LOGIN_FIXTURE_USER } from './fixtures'

test.describe('login', () => {
  test('logs in with an existing fixture user', async ({ page }) => {
    await page.goto('/login')

    const emailInput = page.getByPlaceholder('Enter your email')
    const passwordInput = page.getByPlaceholder('Enter your password')
    const submitButton = page.getByRole('button', { name: 'Login', exact: true })

    await expect(page.getByRole('link', { name: 'Login' })).toBeVisible()
    await expect(submitButton).toBeVisible()

    await emailInput.click()
    await emailInput.pressSequentially(LOGIN_FIXTURE_USER.email)
    await emailInput.blur()

    await passwordInput.click()
    await passwordInput.pressSequentially(LOGIN_FIXTURE_USER.password)
    await passwordInput.blur()

    await expect(submitButton).toBeEnabled()
    await submitButton.click()

    await page.waitForURL('**/app')
    await expect(page).toHaveURL(/\/app$/)
  })
})
