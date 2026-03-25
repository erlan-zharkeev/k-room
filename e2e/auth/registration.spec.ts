import { expect, test } from '@playwright/test'

import { buildRegistrationFixtureUser } from './fixtures'

test.describe('registration', () => {
  test('registers a new user and redirects to wait email confirmation page', async ({ page }) => {
    const user = buildRegistrationFixtureUser()

    await page.goto('/registration')

    const usernameInput = page.getByPlaceholder('Username')
    const emailInput = page.getByPlaceholder('Email')
    const passwordInput = page.getByPlaceholder('Password')
    const policySwitch = page.locator('input[name="policy"]')
    const submitButton = page.getByRole('button', { name: 'Register', exact: true })

    await expect(page.getByRole('link', { name: 'Register' })).toBeVisible()
    await expect(submitButton).toBeVisible()

    await usernameInput.fill(user.username)
    await emailInput.fill(user.email)
    await passwordInput.fill(user.password)
    await policySwitch.check()

    await expect(submitButton).toBeEnabled()
    await submitButton.click()

    await page.waitForURL('**/wait-email-confirm**')
    await expect(page).toHaveURL(/\/wait-email-confirm/)
    await expect(page.getByText(user.email, { exact: false })).toBeVisible()
    await expect(page.getByText('Email confirmation')).toBeVisible()
  })
})
