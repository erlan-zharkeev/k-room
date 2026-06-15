import { expect, type Page } from '@playwright/test'

import { E2E_ENV } from 'e2e/config'

import { dismissFirstRunOverlays } from './app'

export const fillLoginForm = async (page: Page, login: string, password: string) => {
  await page.getByPlaceholder('Enter email or nickname').fill(login)
  await page.getByPlaceholder('Enter your password').fill(password)
}

export const loginByCredentials = async (page: Page, login: string, password: string, timeoutMs?: number) => {
  await page.goto('/authorize/login')
  await fillLoginForm(page, login, password)
  await page.getByRole('button', { name: 'Login', exact: true }).click()

  if (timeoutMs === undefined) {
    await page.waitForURL('**/app/**')
    await dismissFirstRunOverlays(page)
    return
  }

  await page.waitForURL('**/app/**', { timeout: timeoutMs })
  await dismissFirstRunOverlays(page)
}

export const signInWithProvider = async (page: Page, nickname: string, email: string, provider = 'google') => {
  const response = await page.request.post(`${E2E_ENV.PLAYWRIGHT_API_URL}/auth/provider-login`, {
    data: {
      nickname,
      email,
      provider
    }
  })

  expect(response.ok()).toBeTruthy()

  return response
}
