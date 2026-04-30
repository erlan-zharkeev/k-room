import { expect, test, type Page } from '@playwright/test'

import { LOGIN_FIXTURE_USER } from './fixtures'

const login = async (page: Page, value: string) => {
  await page.goto('/authorize/login')

  const loginInput = page.getByPlaceholder('Enter email or nickname')
  const passwordInput = page.getByPlaceholder('Enter your password')
  const submitButton = page.getByRole('button', { name: 'Login', exact: true })

  await expect(page.getByRole('link', { name: 'Login' })).toBeVisible()
  await expect(submitButton).toBeVisible()

  await loginInput.click()
  await loginInput.pressSequentially(value)
  await loginInput.blur()

  await passwordInput.click()
  await passwordInput.pressSequentially(LOGIN_FIXTURE_USER.password)
  await passwordInput.blur()

  await expect(submitButton).toBeEnabled()
  await submitButton.click()

  await page.waitForURL('**/app/**')
  await expect(page).toHaveURL(/\/app/)
}

test.describe('login', () => {
  test('logs in with fixture user email', async ({ page }) => {
    await login(page, LOGIN_FIXTURE_USER.email)
  })

  test('logs in with fixture user nickname', async ({ page }) => {
    await login(page, LOGIN_FIXTURE_USER.nickname)
  })
})
