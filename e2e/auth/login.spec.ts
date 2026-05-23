import { expect, test } from '@playwright/test'

import { loginByCredentials } from 'e2e/shared/auth'
import { LOGIN_FIXTURE_USER } from './fixtures'

test.describe('login', () => {
  test('logs in with fixture user email', async ({ page }) => {
    await loginByCredentials(page, LOGIN_FIXTURE_USER.email, LOGIN_FIXTURE_USER.password)
    await expect(page).toHaveURL(/\/app/)
  })

  test('logs in with fixture user nickname', async ({ page }) => {
    await loginByCredentials(page, LOGIN_FIXTURE_USER.nickname, LOGIN_FIXTURE_USER.password)
    await expect(page).toHaveURL(/\/app/)
  })
})
