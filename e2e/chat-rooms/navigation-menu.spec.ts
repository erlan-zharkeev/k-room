import { expect, test, type Locator, type Page } from '@playwright/test'

import { LOGIN_FIXTURE_USER } from 'e2e/auth/constants'
import { dismissFirstRunOverlays } from 'e2e/shared/app'
import { loginByCredentials } from 'e2e/shared/auth'

import {
  ACTIVE_OVERLAY_SELECTOR,
  ACTIVE_TRANSPARENT_OVERLAY_SELECTOR,
  CANCEL_BUTTON_NAME,
  CHAT_ACTIONS_BUTTON_NAME,
  CHAT_NAME_PLACEHOLDER,
  CHAT_ROOM_LIST_ITEM_NAME_SELECTOR,
  CHAT_ROOM_LIST_ITEM_PIN_SELECTOR,
  CHAT_ROOM_LIST_ITEM_SELECTOR,
  CHAT_ROOMS_PAGE_PATH,
  CHAT_SEARCH_PLACEHOLDER,
  CREATE_CHAT_BUTTON_NAME,
  DELETE_CHAT_ACTION,
  DELETE_CHAT_DIALOG_NAME,
  EDIT_GROUP_ACTION,
  EDIT_GROUP_DIALOG_NAME,
  FRONTEND_CHAT_SEARCH_QUERY,
  FRONTEND_CORE_CHAT_NAME,
  LEAVE_GROUP_ACTION,
  LEAVE_GROUP_DIALOG_NAME,
  MARK_AS_READ_ACTION,
  MUTE_CHAT_ACTION,
  NEW_CHAT_DIALOG_NAME,
  NO_CHATS_FOUND_TEXT,
  PIN_CHAT_ACTION,
  UNKNOWN_CHAT_QUERY,
  UNMUTE_CHAT_ACTION,
  UNPIN_CHAT_ACTION,
  WEEKEND_PLANS_CHAT_NAME
} from './constants'

const CHAT_ROOM_NAVIGATION_TEST_TIMEOUT_MS = 60_000

const openChatRoomsPage = async (page: Page) => {
  await loginByCredentials(page, LOGIN_FIXTURE_USER.email, LOGIN_FIXTURE_USER.password)
  await page.goto(CHAT_ROOMS_PAGE_PATH)
  await expect(page).toHaveURL(new RegExp(CHAT_ROOMS_PAGE_PATH))
  await dismissFirstRunOverlays(page)
  await expect(page.getByPlaceholder(CHAT_SEARCH_PLACEHOLDER)).toBeVisible()
  await expect(getChatRoomRow(page, FRONTEND_CORE_CHAT_NAME)).toBeVisible()
}

const getChatRoomRow = (page: Page, title: string) =>
  page
    .locator(CHAT_ROOM_LIST_ITEM_SELECTOR)
    .filter({ has: page.locator(CHAT_ROOM_LIST_ITEM_NAME_SELECTOR).getByText(title, { exact: true }) })
    .first()

const getActiveDialog = (page: Page, dialogName: string) =>
  page.locator(ACTIVE_OVERLAY_SELECTOR).getByRole('dialog', { name: dialogName }).first()

const clickLabeledControl = async (page: Page, name: string) => {
  const control = page.locator(`[aria-label="${name}"]`).first()
  const button = control.locator('button').first()

  if (await button.count()) {
    await button.click()
    return
  }

  await control.click()
}

const updateSearchInput = async (searchInput: Locator, value: string) => {
  await searchInput.fill(value)
  await expect(searchInput).toHaveValue(value)
}

const openChatRoomMenu = async (page: Page, row: Locator) => {
  await expect(page.locator(ACTIVE_TRANSPARENT_OVERLAY_SELECTOR)).toHaveCount(0)
  await row.locator(`[aria-label="${CHAT_ACTIONS_BUTTON_NAME}"]`).click()
  await expect(page.getByRole('menu', { name: CHAT_ACTIONS_BUTTON_NAME })).toBeVisible()
}

const closeMenu = async (page: Page) => {
  await page.keyboard.press('Escape')
  await expect(page.getByRole('menu', { name: CHAT_ACTIONS_BUTTON_NAME })).toBeHidden()
  await expect(page.locator(ACTIVE_TRANSPARENT_OVERLAY_SELECTOR)).toHaveCount(0)
}

const clickChatRoomMenuAction = async (page: Page, row: Locator, actionName: string) => {
  const menu = page.getByRole('menu', { name: CHAT_ACTIONS_BUTTON_NAME })

  await openChatRoomMenu(page, row)
  await page.getByRole('menuitem', { name: actionName, exact: true }).click()
  await expect(menu).toBeHidden()
  await expect(page.locator(ACTIVE_TRANSPARENT_OVERLAY_SELECTOR)).toHaveCount(0)
}

const expectChatRoomMenuAction = async (page: Page, row: Locator, actionName: string) => {
  await openChatRoomMenu(page, row)
  await expect(page.getByRole('menuitem', { name: actionName, exact: true })).toBeVisible()
  await closeMenu(page)
}

const ensureChatRoomUnpinned = async (page: Page) => {
  const row = getChatRoomRow(page, FRONTEND_CORE_CHAT_NAME)

  await openChatRoomMenu(page, row)

  const unpinAction = page.getByRole('menuitem', { name: UNPIN_CHAT_ACTION, exact: true })

  if (await unpinAction.isVisible()) {
    await unpinAction.click()
    await expect(page.getByRole('menu', { name: CHAT_ACTIONS_BUTTON_NAME })).toBeHidden()
    await expect(page.locator(ACTIVE_TRANSPARENT_OVERLAY_SELECTOR)).toHaveCount(0)
    await expect(getChatRoomRow(page, FRONTEND_CORE_CHAT_NAME).locator(CHAT_ROOM_LIST_ITEM_PIN_SELECTOR)).toHaveCount(0)
    return
  }

  await closeMenu(page)
}

const ensureChatRoomUnmuted = async (page: Page) => {
  const row = getChatRoomRow(page, FRONTEND_CORE_CHAT_NAME)

  await openChatRoomMenu(page, row)

  const unmuteAction = page.getByRole('menuitem', { name: UNMUTE_CHAT_ACTION, exact: true })

  if (await unmuteAction.isVisible()) {
    await unmuteAction.click()
    await expect(page.getByRole('menu', { name: CHAT_ACTIONS_BUTTON_NAME })).toBeHidden()
    await expect(page.locator(ACTIVE_TRANSPARENT_OVERLAY_SELECTOR)).toHaveCount(0)
    await expectChatRoomMenuAction(page, getChatRoomRow(page, FRONTEND_CORE_CHAT_NAME), MUTE_CHAT_ACTION)
    return
  }

  await closeMenu(page)
}

const expectDialogAndCancel = async (page: Page, dialogName: string) => {
  const dialog = getActiveDialog(page, dialogName)

  await expect(dialog).toBeVisible()
  await dialog.getByRole('button', { name: CANCEL_BUTTON_NAME, exact: true }).click()
  await expect(dialog).toBeHidden()
}

test.describe('chat room navigation menu', () => {
  test.setTimeout(CHAT_ROOM_NAVIGATION_TEST_TIMEOUT_MS)

  test('filters chat list and opens the create chat dialog', async ({ page }) => {
    await openChatRoomsPage(page)

    const searchInput = page.getByPlaceholder(CHAT_SEARCH_PLACEHOLDER)

    await expect(getChatRoomRow(page, WEEKEND_PLANS_CHAT_NAME)).toBeVisible()

    await updateSearchInput(searchInput, FRONTEND_CHAT_SEARCH_QUERY)
    await expect(getChatRoomRow(page, FRONTEND_CORE_CHAT_NAME)).toBeVisible()
    await expect(getChatRoomRow(page, WEEKEND_PLANS_CHAT_NAME)).toHaveCount(0)

    await updateSearchInput(searchInput, UNKNOWN_CHAT_QUERY)
    await expect(page.getByText(NO_CHATS_FOUND_TEXT)).toBeVisible()
    await expect(getChatRoomRow(page, FRONTEND_CORE_CHAT_NAME)).toHaveCount(0)

    await updateSearchInput(searchInput, '')
    await clickLabeledControl(page, CREATE_CHAT_BUTTON_NAME)

    const dialog = getActiveDialog(page, NEW_CHAT_DIALOG_NAME)

    await expect(dialog).toBeVisible()
    await expect(dialog.getByPlaceholder(CHAT_NAME_PLACEHOLDER)).toBeVisible()
    await dialog.getByRole('button', { name: CANCEL_BUTTON_NAME, exact: true }).click()
    await expect(dialog).toBeHidden()
  })

  test('exposes chat context actions without touching messages', async ({ page }) => {
    await openChatRoomsPage(page)
    await ensureChatRoomUnpinned(page)
    await ensureChatRoomUnmuted(page)

    await clickChatRoomMenuAction(page, getChatRoomRow(page, FRONTEND_CORE_CHAT_NAME), PIN_CHAT_ACTION)
    await expect(getChatRoomRow(page, FRONTEND_CORE_CHAT_NAME).locator(CHAT_ROOM_LIST_ITEM_PIN_SELECTOR)).toBeVisible()

    await expectChatRoomMenuAction(page, getChatRoomRow(page, FRONTEND_CORE_CHAT_NAME), UNPIN_CHAT_ACTION)
    await clickChatRoomMenuAction(page, getChatRoomRow(page, FRONTEND_CORE_CHAT_NAME), UNPIN_CHAT_ACTION)
    await expect(getChatRoomRow(page, FRONTEND_CORE_CHAT_NAME).locator(CHAT_ROOM_LIST_ITEM_PIN_SELECTOR)).toHaveCount(0)

    await clickChatRoomMenuAction(page, getChatRoomRow(page, FRONTEND_CORE_CHAT_NAME), MUTE_CHAT_ACTION)
    await expectChatRoomMenuAction(page, getChatRoomRow(page, FRONTEND_CORE_CHAT_NAME), UNMUTE_CHAT_ACTION)
    await clickChatRoomMenuAction(page, getChatRoomRow(page, FRONTEND_CORE_CHAT_NAME), UNMUTE_CHAT_ACTION)
    await expectChatRoomMenuAction(page, getChatRoomRow(page, FRONTEND_CORE_CHAT_NAME), MUTE_CHAT_ACTION)

    await openChatRoomMenu(page, getChatRoomRow(page, FRONTEND_CORE_CHAT_NAME))
    await expect(page.getByRole('menuitem', { name: MARK_AS_READ_ACTION, exact: true })).toBeVisible()
    await expect(page.getByRole('menuitem', { name: EDIT_GROUP_ACTION, exact: true })).toBeVisible()
    await expect(page.getByRole('menuitem', { name: DELETE_CHAT_ACTION, exact: true })).toBeVisible()
    await expect(page.getByRole('menuitem', { name: LEAVE_GROUP_ACTION, exact: true })).toBeVisible()
    await closeMenu(page)

    await clickChatRoomMenuAction(page, getChatRoomRow(page, FRONTEND_CORE_CHAT_NAME), EDIT_GROUP_ACTION)
    await expectDialogAndCancel(page, EDIT_GROUP_DIALOG_NAME)

    await clickChatRoomMenuAction(page, getChatRoomRow(page, FRONTEND_CORE_CHAT_NAME), DELETE_CHAT_ACTION)
    await expectDialogAndCancel(page, DELETE_CHAT_DIALOG_NAME)

    await clickChatRoomMenuAction(page, getChatRoomRow(page, FRONTEND_CORE_CHAT_NAME), LEAVE_GROUP_ACTION)
    await expectDialogAndCancel(page, LEAVE_GROUP_DIALOG_NAME)
  })
})
