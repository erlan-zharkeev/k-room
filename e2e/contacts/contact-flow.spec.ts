import { expect, test, type Browser, type Locator, type Page } from '@playwright/test'

import { E2E_ENV } from 'e2e/config'
import { getAppDbName, readStores } from 'e2e/shared/indexed-db'

import {
  ACCEPT_CONTACT_ACTION,
  ADD_CONTACT_BUTTON_NAME,
  CHAT_ROOM_ROUTE_PATTERN,
  CHAT_ROOMS_DB_STORE_NAME,
  CONTACT_ACTIONS_BUTTON_NAME,
  CONTACT_E2E_EMAIL_DOMAIN,
  CONTACT_E2E_FLOW_TIMEOUT_MS,
  CONTACT_E2E_NICKNAME_PREFIX,
  CONTACT_E2E_PROVIDER,
  CONTACT_E2E_SOCKET_SYNC_TIMEOUT_MS,
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
  ContactE2EUserRoleType,
  IContactE2EIndexedDbChatRoom,
  IContactE2EIndexedDbContact,
  IContactE2EProviderLoginResponse,
  IContactE2EUser
} from './types'

const buildContactUser = (role: ContactE2EUserRoleType): Omit<IContactE2EUser, 'id'> => {
  const roleKey = role === 'author' ? 'a' : 'i'
  const suffix = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
  const nickname = `${CONTACT_E2E_NICKNAME_PREFIX}-${roleKey}-${suffix}`

  return {
    nickname,
    email: `${nickname}@${CONTACT_E2E_EMAIL_DOMAIN}`
  }
}

const signInWithProvider = async (page: Page, role: ContactE2EUserRoleType): Promise<IContactE2EUser> => {
  const user = buildContactUser(role)
  const response = await page.request.post(`${E2E_ENV.PLAYWRIGHT_API_URL}/auth/provider-login`, {
    data: {
      ...user,
      provider: CONTACT_E2E_PROVIDER
    }
  })

  expect(response.ok()).toBeTruthy()

  const body = (await response.json()) as IContactE2EProviderLoginResponse

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
}

const getContactListRow = (page: Page, nickname: string) =>
  page.locator('.contact-list__item').filter({ hasText: nickname })

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

const readContacts = async (page: Page, dbName: string) => {
  const stores = await readStores(page, dbName, [CONTACTS_DB_STORE_NAME])

  return stores[CONTACTS_DB_STORE_NAME] as IContactE2EIndexedDbContact[]
}

const readChatRooms = async (page: Page, dbName: string) => {
  const stores = await readStores(page, dbName, [CHAT_ROOMS_DB_STORE_NAME])

  return stores[CHAT_ROOMS_DB_STORE_NAME] as IContactE2EIndexedDbChatRoom[]
}

const getStoredContact = async (page: Page, dbName: string, contactId: string) => {
  const contacts = await readContacts(page, dbName)

  return contacts.find(({ id }) => id === contactId) ?? null
}

const expectStoredContactInteraction = async (
  page: Page,
  dbName: string,
  contactId: string,
  interactionType: IContactE2EIndexedDbContact['interactionType'] | null
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

const expectStoredPrivateChatRoom = async (page: Page, dbName: string, contactId: string) => {
  await expect
    .poll(
      async () => {
        const rooms = await readChatRooms(page, dbName)

        return rooms.some(({ users }) => users.length === 1 && users[0] === contactId)
      },
      { timeout: CONTACT_E2E_SOCKET_SYNC_TIMEOUT_MS }
    )
    .toBe(true)
}

const addContactFromSearch = async (page: Page, contact: IContactE2EUser) => {
  await page.getByPlaceholder(CONTACTS_SEARCH_PLACEHOLDER).fill(contact.nickname)

  const searchRow = getContactSearchRow(page, contact.nickname)

  await expect(searchRow).toBeVisible()
  await clickIconButton(searchRow, ADD_CONTACT_BUTTON_NAME)

  await expect(searchRow).toHaveCount(0)
  await expect(getContactListRow(page, contact.nickname)).toBeVisible()
}

const inviteContact = async (page: Page, contact: IContactE2EUser) => {
  const row = getContactListRow(page, contact.nickname)

  await clickIconButton(row, INVITE_BUTTON_NAME)
  await expect(row).toContainText(INVITED_CONTACT_STATUS)
}

const acceptInvite = async (page: Page, contact: IContactE2EUser) => {
  const row = getContactListRow(page, contact.nickname)

  await expect(row).toContainText(INVITE_RECEIVED_CONTACT_STATUS)
  await clickIconButton(row, CONTACT_ACTIONS_BUTTON_NAME)
  await page.getByRole('menuitem', { name: ACCEPT_CONTACT_ACTION }).click()
  await expect(row).not.toContainText(INVITE_RECEIVED_CONTACT_STATUS)
}

const createPrivateChat = async (page: Page, contact: IContactE2EUser) => {
  const row = getContactListRow(page, contact.nickname)

  await expect(row.locator(`[aria-label="${CREATE_CHAT_BUTTON_NAME}"]`)).toBeVisible()
  await clickIconButton(row, CREATE_CHAT_BUTTON_NAME)
  await page.waitForURL(CHAT_ROOM_ROUTE_PATTERN)
}

const deleteContact = async (page: Page, contact: IContactE2EUser) => {
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
      await expectStoredPrivateChatRoom(page, authorDbName, interlocutor.id)
      await expectStoredPrivateChatRoom(secondUserPage.page, interlocutorDbName, author.id)

      await openContactsPage(page)
      await deleteContact(page, interlocutor)
      await expectStoredContactInteraction(page, authorDbName, interlocutor.id, null)
      await expectStoredContactInteraction(secondUserPage.page, interlocutorDbName, author.id, 'default')
      await expect(
        getContactListRow(secondUserPage.page, author.nickname).locator(`[aria-label="${INVITE_BUTTON_NAME}"]`)
      ).toBeVisible()
    } finally {
      await secondUserPage.context.close()
    }
  })
})
