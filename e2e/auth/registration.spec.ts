import { expect, test } from '@playwright/test'

import { buildRegistrationFixtureUser } from './lib'

test.describe('registration', () => {
  test('registers a new user and redirects to wait email confirmation page', async ({ page }) => {
    const user = buildRegistrationFixtureUser()

    await page.goto('/authorize/registration')

    const nicknameInput = page.getByPlaceholder('Nickname')
    const emailInput = page.getByPlaceholder('Email')
    const passwordInput = page.getByPlaceholder('Password')
    const policySwitch = page.locator('input[name="policy"]')
    const submitButton = page.getByRole('button', { name: 'Register', exact: true })

    await expect(nicknameInput).toBeVisible({ timeout: 15_000 })
    await expect(submitButton).toBeVisible()

    await nicknameInput.fill(user.nickname)
    await emailInput.fill(user.email)
    await passwordInput.fill(user.password)
    await policySwitch.check({ force: true })

    await expect(submitButton).toBeEnabled()
    await submitButton.click()

    await page.waitForURL('**/wait-email-confirm**')
    await expect(page).toHaveURL(/\/wait-email-confirm/)
    await expect(page.getByText(user.email, { exact: false })).toBeVisible()
    await expect(page.getByText('Email confirmation')).toBeVisible()
  })

  test('rejects nickname with uppercase letters and spaces', async ({ page }) => {
    const user = buildRegistrationFixtureUser()

    await page.goto('/authorize/registration')

    const nicknameInput = page.getByPlaceholder('Nickname')
    const emailInput = page.getByPlaceholder('Email')
    const passwordInput = page.getByPlaceholder('Password')
    const policySwitch = page.locator('input[name="policy"]')
    const submitButton = page.getByRole('button', { name: 'Register', exact: true })

    await expect(nicknameInput).toBeVisible({ timeout: 15_000 })

    await nicknameInput.fill('Bad Nick')
    await emailInput.fill(user.email)
    await passwordInput.fill(user.password)
    await policySwitch.check({ force: true })
    await nicknameInput.blur()

    await expect(submitButton).toBeDisabled()
    await expect(
      page.getByText('Nickname can contain only lowercase Latin letters, numbers, and single ., -, _ separators')
    ).toBeVisible()
  })
})
