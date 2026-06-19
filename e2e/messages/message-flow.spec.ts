import { expect, test, type Locator, type Page } from '@playwright/test'

import { E2E_ENV } from 'e2e/config'
import { dismissFirstRunOverlays } from 'e2e/shared/app'
import { signInWithProvider } from 'e2e/shared/auth'

const CONTACTS_PAGE_PATH = '/app/contacts'
const CONTACTS_SEARCH_PLACEHOLDER = 'Search contact'
const CONTACT_ACTIONS_BUTTON_NAME = 'Contact actions'
const ADD_CONTACT_BUTTON_NAME = 'Add contact'
const INVITE_BUTTON_NAME = 'Invite'
const ACCEPT_CONTACT_ACTION = 'Accept'
const CREATE_CHAT_BUTTON_NAME = 'Create chat'
const MESSAGE_INPUT_PLACEHOLDER = 'Message'
const SEND_MESSAGE_BUTTON_NAME = 'Send message'
const MESSAGE_FLOW_TEST_TIMEOUT_MS = 90_000
const CONTACT_E2E_SOCKET_SYNC_TIMEOUT_MS = 15_000

const buildMessageUser = (role: 'author' | 'interlocutor') => {
  const roleKey = role === 'author' ? 'a' : 'i'
  const suffix = `${Date.now().toString(36).slice(-6)}-${Math.random().toString(36).slice(2, 6)}`

  return {
    nickname: `pw-msg-${roleKey}-${suffix}`,
    email: `pw-msg-${roleKey}-${suffix}@example.com`
  }
}

const clickIconButton = async (root: Page | Locator, name: string) => {
  const control = root.locator(`[aria-label="${name}"]`).first()
  const button = control.locator('button').first()

  if (await button.count()) {
    await button.click()
    return
  }

  await control.click()
}

const getContactListRow = (page: Page, nickname: string) =>
  page.locator('.contact-list__item').filter({ hasText: nickname })

const getContactSearchRow = (page: Page, nickname: string) =>
  page.locator('.contacts-search__item').filter({ hasText: nickname })

const openContactsPage = async (page: Page) => {
  await page.goto(CONTACTS_PAGE_PATH)
  await expect(page).toHaveURL(new RegExp(CONTACTS_PAGE_PATH))
  await expect(page.getByPlaceholder(CONTACTS_SEARCH_PLACEHOLDER)).toBeVisible()
}

test.describe('message flow', () => {
  test.setTimeout(MESSAGE_FLOW_TEST_TIMEOUT_MS)

  test('sends text message to private chat and renders it in message list', async ({ browser, page }) => {
    const messageText = `playwright message ${Date.now()}`
    const author = buildMessageUser('author')
    const interlocutor = buildMessageUser('interlocutor')
    const secondContext = await browser.newContext({
      baseURL: E2E_ENV.PLAYWRIGHT_BASE_URL,
      ignoreHTTPSErrors: true
    })
    const secondPage = await secondContext.newPage()

    try {
      await signInWithProvider(page, author.nickname, author.email)
      await signInWithProvider(secondPage, interlocutor.nickname, interlocutor.email)

      await openContactsPage(page)
      await openContactsPage(secondPage)
      await dismissFirstRunOverlays(page)
      await dismissFirstRunOverlays(secondPage)

      await page.getByPlaceholder(CONTACTS_SEARCH_PLACEHOLDER).fill(interlocutor.nickname)
      const searchRow = getContactSearchRow(page, interlocutor.nickname)

      await expect(searchRow).toBeVisible()
      await clickIconButton(searchRow, ADD_CONTACT_BUTTON_NAME)
      await expect(getContactListRow(page, interlocutor.nickname)).toBeVisible()

      const authorContactRow = getContactListRow(page, interlocutor.nickname)

      await clickIconButton(authorContactRow, CONTACT_ACTIONS_BUTTON_NAME)
      await page.getByRole('menuitem', { name: INVITE_BUTTON_NAME }).click()

      await expect
        .poll(async () => (await getContactListRow(secondPage, author.nickname).count()) > 0, {
          timeout: CONTACT_E2E_SOCKET_SYNC_TIMEOUT_MS
        })
        .toBe(true)

      const interlocutorContactRow = getContactListRow(secondPage, author.nickname)

      await clickIconButton(interlocutorContactRow, CONTACT_ACTIONS_BUTTON_NAME)
      await secondPage.getByRole('menuitem', { name: ACCEPT_CONTACT_ACTION }).click()

      await clickIconButton(authorContactRow, CONTACT_ACTIONS_BUTTON_NAME)
      await page.getByRole('menuitem', { name: CREATE_CHAT_BUTTON_NAME }).click()
      await expect(page).toHaveURL(/\/app\/chat-rooms\/[^/?]+/)

      await page.getByPlaceholder(MESSAGE_INPUT_PLACEHOLDER).fill(messageText)
      await dismissFirstRunOverlays(page)
      await clickIconButton(page, SEND_MESSAGE_BUTTON_NAME)

      await expect(page.getByRole('article').filter({ hasText: messageText })).toBeVisible()
    } finally {
      await secondContext.close()
    }
  })
})
