import { expect, test, type Browser, type Locator, type Page } from '@playwright/test'

import { CHAT_KIND } from 'global-shared'

import { E2E_ENV } from 'e2e/config'
import { dismissFirstRunOverlays } from 'e2e/shared/app'
import { signInWithProvider as signInWithProviderRequest } from 'e2e/shared/auth'
import { getAppDbName, readStores } from 'e2e/shared/indexed-db'

import {
  ACCEPT_CONTACT_ACTION,
  ADD_CONTACT_BUTTON_NAME,
  APP_PROFILE_BASIC_DATA_DESCRIPTION_SELECTOR,
  CHAT_ROOM_ROUTE_PATTERN,
  CHAT_ROOMS_DB_STORE_NAME,
  CONTACT_ACTIONS_BUTTON_NAME,
  CONTACT_E2E_EMAIL_DOMAIN,
  CONTACT_E2E_FLOW_TIMEOUT_MS,
  CONTACT_E2E_NICKNAME_PREFIX,
  CONTACT_E2E_PROVIDER,
  CONTACT_E2E_SOCKET_SYNC_TIMEOUT_MS,
  CONTACT_LIST_BADGE_SELECTOR,
  CONTACTS_DB_STORE_NAME,
  CONTACTS_PAGE_PATH,
  CONTACTS_SEARCH_PLACEHOLDER,
  CREATE_CHAT_BUTTON_NAME,
  DELETE_BUTTON_NAME,
  INVITE_BUTTON_NAME,
  INVITE_RECEIVED_CONTACT_STATUS,
  INVITED_CONTACT_STATUS
} from './constants'
import type {
  ContactE2EUserRole,
  ContactE2EIndexedDbChatRoom,
  ContactE2EIndexedDbContact,
  ContactE2EProviderLoginResponse,
  ContactE2EUser
} from './types'

const buildContactUser = (role: ContactE2EUserRole): Omit<ContactE2EUser, 'id'> => {
  const roleKey = role === 'author' ? 'a' : 'i'
  const suffix = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
  const nickname = `${CONTACT_E2E_NICKNAME_PREFIX}-${roleKey}-${suffix}`

  return {
    nickname,
    email: `${nickname}@${CONTACT_E2E_EMAIL_DOMAIN}`
  }
}

const signInWithProvider = async (page: Page, role: ContactE2EUserRole): Promise<ContactE2EUser> => {
  const user = buildContactUser(role)
  const response = await signInWithProviderRequest(page, user.nickname, user.email, CONTACT_E2E_PROVIDER)
  const body = (await response.json()) as ContactE2EProviderLoginResponse

  expect(body.payload).toEqual(expect.objectContaining(user))

  return {
    ...user,
    id: body.payload.id
  }
}

const createSecondUserPage = async (browser: Browser) => {
  const context = await browser.newContext({
    baseURL: E2E_ENV.PLAYWRIGHT_BASE_URL,
    ignoreHTTPSErrors: true
  })
  const page = await context.newPage()

  return { context, page }
}

const openContactsPage = async (page: Page) => {
  await page.goto(CONTACTS_PAGE_PATH)
  await expect(page).toHaveURL(new RegExp(CONTACTS_PAGE_PATH))
  await expect(page.getByPlaceholder(CONTACTS_SEARCH_PLACEHOLDER)).toBeVisible()
  await dismissFirstRunOverlays(page)
}

const getContactListRow = (page: Page, nickname: string) =>
  page.locator('.contact-list__item').filter({ hasText: nickname })

const getContactListBadge = (page: Page, nickname: string) =>
  page.locator(CONTACT_LIST_BADGE_SELECTOR).filter({ hasText: nickname })

const getContactSearchRow = (page: Page, nickname: string) =>
  page.locator('.contacts-search__item').filter({ hasText: nickname })

const clickIconButton = async (root: Page | Locator, name: string) => {
  const control = root.locator(`[aria-label="${name}"]`).first()
  const button = control.locator('button').first()

  if (await button.count()) {
    await button.click()
    return
  }

  await control.click()
}

const selectContextMenuAction = async (page: Page, row: Locator, actionName: string) => {
  await clickIconButton(row, CONTACT_ACTIONS_BUTTON_NAME)
  await page.getByRole('menuitem', { name: actionName }).click()
}

const expectContextMenuAction = async (page: Page, row: Locator, actionName: string) => {
  await clickIconButton(row, CONTACT_ACTIONS_BUTTON_NAME)
  await expect(page.getByRole('menuitem', { name: actionName })).toBeVisible()
  await page.keyboard.press('Escape')
}

const readContacts = async (page: Page, dbName: string) => {
  const stores = await readStores(page, dbName, [CONTACTS_DB_STORE_NAME])

  return stores[CONTACTS_DB_STORE_NAME] as ContactE2EIndexedDbContact[]
}

const readChatRooms = async (page: Page, dbName: string) => {
  const stores = await readStores(page, dbName, [CHAT_ROOMS_DB_STORE_NAME])

  return stores[CHAT_ROOMS_DB_STORE_NAME] as ContactE2EIndexedDbChatRoom[]
}

const getStoredContact = async (page: Page, dbName: string, contactId: string) => {
  const contacts = await readContacts(page, dbName)

  return contacts.find(({ id }) => id === contactId) ?? null
}

const expectStoredContactInteraction = async (
  page: Page,
  dbName: string,
  contactId: string,
  interactionType: ContactE2EIndexedDbContact['interactionType'] | null
) => {
  await expect
    .poll(
      async () => {
        const contact = await getStoredContact(page, dbName, contactId)

        return contact?.interactionType ?? null
      },
      { timeout: CONTACT_E2E_SOCKET_SYNC_TIMEOUT_MS }
    )
    .toBe(interactionType)
}

const expectStoredPrivateChatRoom = async (page: Page, dbName: string, userId: string, contactId: string) => {
  await expect
    .poll(
      async () => {
        const rooms = await readChatRooms(page, dbName)

        return rooms.some(
          ({ chatKind, users }) =>
            chatKind === CHAT_KIND.DIRECT && users.length === 2 && users.includes(userId) && users.includes(contactId)
        )
      },
      { timeout: CONTACT_E2E_SOCKET_SYNC_TIMEOUT_MS }
    )
    .toBe(true)
}

const addContactFromSearch = async (page: Page, contact: ContactE2EUser) => {
  await page.getByPlaceholder(CONTACTS_SEARCH_PLACEHOLDER).fill(contact.nickname)

  const searchRow = getContactSearchRow(page, contact.nickname)

  await expect(searchRow).toBeVisible()
  await expect(searchRow.locator(APP_PROFILE_BASIC_DATA_DESCRIPTION_SELECTOR)).toHaveCount(0)
  await clickIconButton(searchRow, ADD_CONTACT_BUTTON_NAME)

  await expect(searchRow).toHaveCount(0)
  await expect(getContactListRow(page, contact.nickname)).toBeVisible()
}

const inviteContact = async (page: Page, contact: ContactE2EUser) => {
  const row = getContactListRow(page, contact.nickname)

  await selectContextMenuAction(page, row, INVITE_BUTTON_NAME)
  await expect(getContactListBadge(page, contact.nickname)).toContainText(INVITED_CONTACT_STATUS)
}

const acceptInvite = async (page: Page, contact: ContactE2EUser) => {
  const row = getContactListRow(page, contact.nickname)
  const badge = getContactListBadge(page, contact.nickname)

  await expect(badge).toContainText(INVITE_RECEIVED_CONTACT_STATUS)
  await clickIconButton(row, CONTACT_ACTIONS_BUTTON_NAME)
  await page.getByRole('menuitem', { name: ACCEPT_CONTACT_ACTION }).click()
  await expect(badge).not.toContainText(INVITE_RECEIVED_CONTACT_STATUS)
}

const createPrivateChat = async (page: Page, contact: ContactE2EUser) => {
  const row = getContactListRow(page, contact.nickname)

  await selectContextMenuAction(page, row, CREATE_CHAT_BUTTON_NAME)
  await page.waitForURL(CHAT_ROOM_ROUTE_PATTERN)
}

const deleteContact = async (page: Page, contact: ContactE2EUser) => {
  const row = getContactListRow(page, contact.nickname)

  await clickIconButton(row, CONTACT_ACTIONS_BUTTON_NAME)
  await page.getByRole('menuitem', { name: DELETE_BUTTON_NAME }).click()
  await page.locator('.contacts-delete-dialog').getByRole('button', { name: DELETE_BUTTON_NAME }).click()
  await expect(row).toHaveCount(0)
}

test.describe('contacts e2e flow', () => {
  test.setTimeout(CONTACT_E2E_FLOW_TIMEOUT_MS)

  test('searches, adds, invites, accepts, creates a private chat, and deletes accepted contact', async ({
    browser,
    page
  }) => {
    const secondUserPage = await createSecondUserPage(browser)

    try {
      const author = await signInWithProvider(page, 'author')
      const interlocutor = await signInWithProvider(secondUserPage.page, 'interlocutor')

      await openContactsPage(page)
      await openContactsPage(secondUserPage.page)

      const authorDbName = await getAppDbName(page)
      const interlocutorDbName = await getAppDbName(secondUserPage.page)

      await addContactFromSearch(page, interlocutor)
      await expectStoredContactInteraction(page, authorDbName, interlocutor.id, 'default')

      await inviteContact(page, interlocutor)
      await expectStoredContactInteraction(page, authorDbName, interlocutor.id, 'invited')
      await expectStoredContactInteraction(secondUserPage.page, interlocutorDbName, author.id, 'invite-received')

      await acceptInvite(secondUserPage.page, author)
      await expectStoredContactInteraction(page, authorDbName, interlocutor.id, 'invite-accepted')
      await expectStoredContactInteraction(secondUserPage.page, interlocutorDbName, author.id, 'invite-accepted')

      await createPrivateChat(page, interlocutor)
      await expectStoredPrivateChatRoom(page, authorDbName, author.id, interlocutor.id)
      await expectStoredPrivateChatRoom(secondUserPage.page, interlocutorDbName, interlocutor.id, author.id)

      await openContactsPage(page)
      await deleteContact(page, interlocutor)
      await expectStoredContactInteraction(page, authorDbName, interlocutor.id, null)
      await expectStoredContactInteraction(secondUserPage.page, interlocutorDbName, author.id, 'default')
      await expectContextMenuAction(
        secondUserPage.page,
        getContactListRow(secondUserPage.page, author.nickname),
        INVITE_BUTTON_NAME
      )
    } finally {
      await secondUserPage.context.close()
    }
  })
})
