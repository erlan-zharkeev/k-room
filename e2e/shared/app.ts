import type { Page } from '@playwright/test'

const FIRST_RUN_OVERLAY_TIMEOUT_MS = 1_000
const FIRST_RUN_OVERLAY_VISIBILITY_TIMEOUT_MS = 100
const FIRST_RUN_OVERLAY_DISMISS_ATTEMPTS = 4
const FIRST_RUN_OVERLAY_RETRY_DELAY_MS = 500
const WELCOME_CONTINUE_BUTTON_NAME = 'Continue'
const ONBOARDING_SKIP_BUTTON_NAME = 'Skip'
const ONBOARDING_GUIDE_CLOSE_BUTTON_SELECTOR = '.nmorph-guide-step__close button'
const WELCOME_CONTINUE_BUTTON_SELECTOR = '.app-welcome-dialog button'
const TOP_BAR_LOGOUT_BUTTON_SELECTOR = '.top-bar__content-right-side button'

const clickOptionalButton = async (page: Page, selector: string) => {
  const button = page.locator(selector).first()
  const isVisible = await button.isVisible({ timeout: FIRST_RUN_OVERLAY_VISIBILITY_TIMEOUT_MS }).catch(() => false)

  if (!isVisible) return false

  return button
    .click({ force: true, timeout: FIRST_RUN_OVERLAY_TIMEOUT_MS })
    .then(() => true)
    .catch(() => false)
}

const clickOptionalVisibleButton = async (page: Page, name: string) => {
  const button = page.getByRole('button', { name, exact: true }).first()
  const isVisible = await button.isVisible({ timeout: FIRST_RUN_OVERLAY_VISIBILITY_TIMEOUT_MS }).catch(() => false)

  if (!isVisible) return false

  return button
    .click({ force: true, timeout: FIRST_RUN_OVERLAY_TIMEOUT_MS })
    .then(() => true)
    .catch(() => false)
}

export const dismissFirstRunOverlays = async (page: Page) => {
  for (let attempt = 0; attempt < FIRST_RUN_OVERLAY_DISMISS_ATTEMPTS; attempt += 1) {
    await clickOptionalButton(page, ONBOARDING_GUIDE_CLOSE_BUTTON_SELECTOR)
    await clickOptionalButton(page, WELCOME_CONTINUE_BUTTON_SELECTOR)
    await clickOptionalVisibleButton(page, WELCOME_CONTINUE_BUTTON_NAME)
    await clickOptionalVisibleButton(page, ONBOARDING_SKIP_BUTTON_NAME)

    if (attempt < FIRST_RUN_OVERLAY_DISMISS_ATTEMPTS - 1) {
      await page.waitForTimeout(FIRST_RUN_OVERLAY_RETRY_DELAY_MS)
    }
  }
}

export const getLogoutButton = (page: Page) => page.locator(TOP_BAR_LOGOUT_BUTTON_SELECTOR).last()

export const logoutFromApp = async (page: Page) => {
  if (!page.url().includes('/app')) return

  await getLogoutButton(page).click()
  await page.waitForURL('**/authorize/login')
}
