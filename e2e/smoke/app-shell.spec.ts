import { expect, test } from '@playwright/test'

import { signInWithProvider } from 'e2e/shared/auth'

const buildSmokeUser = () => {
  const suffix = Date.now().toString(36)

  return {
    nickname: `pw-smoke-${suffix}`,
    email: `pw-smoke-${suffix}@example.com`
  }
}

test.describe('smoke app shell', () => {
  test('@smoke redirects guest from app to login', async ({ page }) => {
    await page.goto('/app')

    await expect(page).toHaveURL(/\/authorize\/login/)
  })

  test('@smoke opens core app sections after provider login', async ({ page }) => {
    const errors: string[] = []
    const user = buildSmokeUser()

    page.on('pageerror', (error) => {
      errors.push(error.message)
    })

    await signInWithProvider(page, user.nickname, user.email)

    await page.goto('/app/chat-rooms')
    await expect(page).toHaveURL(/\/app\/chat-rooms/)

    await page.goto('/app/calls')
    await expect(page).toHaveURL(/\/app\/calls/)

    await page.goto('/app/contacts')
    await expect(page).toHaveURL(/\/app\/contacts/)

    await page.goto('/app/settings')
    await expect(page).toHaveURL(/\/app\/settings/)
    expect(errors).toEqual([])
  })
})
