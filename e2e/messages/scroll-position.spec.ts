import { expect, test, type Locator, type Page } from '@playwright/test'

import { LOGIN_FIXTURE_USER } from 'e2e/auth/constants'
import { dismissFirstRunOverlays } from 'e2e/shared/app'
import { loginByCredentials } from 'e2e/shared/auth'
import { getAppDbName } from 'e2e/shared/indexed-db'

import {
  MESSAGE_SCROLL_ANCHOR_OFFSET_TOLERANCE_PX,
  MESSAGE_SCROLL_CHAT_NAMES,
  MESSAGE_SCROLL_PAGE_PATH,
  MESSAGE_SCROLL_SEARCH_PLACEHOLDER,
  MESSAGE_SCROLL_SYNC_TIMEOUT_MS,
  MESSAGE_SCROLL_TARGET_RATIOS,
  MESSAGE_SCROLL_TEST_TIMEOUT_MS
} from './scroll-position.constants'

interface MessageScrollSnapshot {
  firstVisibleMessage: {
    text: string
    top: number
  } | null
  scrollTop: number
}

const getChatRoomRow = (page: Page, title: string) =>
  page.locator('.chat-room-list-item').filter({ has: page.locator('.chat-room-list-item__name').getByText(title) })

const getMessagesScrollViewport = (page: Page) =>
  page.locator('.chat-room-messages__scroll .nmorph-scroll__viewport').first()

const openChatRoomsPage = async (page: Page) => {
  await loginByCredentials(page, LOGIN_FIXTURE_USER.email, LOGIN_FIXTURE_USER.password)
  await page.goto(MESSAGE_SCROLL_PAGE_PATH)
  await dismissFirstRunOverlays(page)
  await expect(page.getByPlaceholder(MESSAGE_SCROLL_SEARCH_PLACEHOLDER)).toBeVisible()
}

const openChatRoom = async (page: Page, title: string) => {
  const row = getChatRoomRow(page, title)

  await expect(row).toBeVisible()
  await row.locator('.chat-room-list-item__link').click()
  await expect(page).toHaveURL(/\/app\/chat-rooms\/[^/?]+/)
  await expect(page.getByRole('heading', { name: title })).toBeVisible()

  return new URL(page.url()).pathname.split('/').at(-1)!
}

const waitForImageMessages = async (page: Page) => {
  const gallery = page.locator('.message-media-gallery').first()
  const images = gallery.locator('img')

  await expect(gallery).toBeVisible({
    timeout: MESSAGE_SCROLL_SYNC_TIMEOUT_MS
  })
  await expect
    .poll(
      () =>
        images.evaluateAll(
          (elements) =>
            elements.length > 0 &&
            elements.every((element) => {
              const image = element as HTMLImageElement

              return image.complete && image.naturalWidth > 0
            })
        ),
      { timeout: MESSAGE_SCROLL_SYNC_TIMEOUT_MS }
    )
    .toBe(true)
}

const waitForChatContentReady = async (page: Page) => {
  await expect(page.locator('.chat-room-messages > .app-loading-progress')).toBeHidden({
    timeout: MESSAGE_SCROLL_SYNC_TIMEOUT_MS
  })
  await waitForImageMessages(page)
}

const readVisibleMessageSnapshot = async (viewport: Locator): Promise<MessageScrollSnapshot> => {
  return viewport.evaluate((scrollElement) => {
    const viewportRect = scrollElement.getBoundingClientRect()
    const messages = Array.from(scrollElement.querySelectorAll<HTMLElement>('.message-body'))
      .map((message) => {
        const rect = message.getBoundingClientRect()
        const visibleTop = Math.max(rect.top, viewportRect.top)
        const visibleBottom = Math.min(rect.bottom, viewportRect.bottom)
        const visibleHeight = Math.max(visibleBottom - visibleTop, 0)

        return {
          text: message.innerText,
          top: rect.top - viewportRect.top,
          visibleHeight
        }
      })
      .filter(({ text, visibleHeight }) => text.trim() && visibleHeight > 24)

    return {
      firstVisibleMessage: messages[0] ?? null,
      scrollTop: scrollElement.scrollTop
    }
  })
}

const scrollMessagesToRatio = async (viewport: Locator, ratio: number) => {
  await viewport.evaluate((scrollElement, targetRatio) => {
    scrollElement.scrollTop = Math.max((scrollElement.scrollHeight - scrollElement.clientHeight) * targetRatio, 0)
    scrollElement.dispatchEvent(new Event('scroll', { bubbles: true }))
  }, ratio)
}

const hasSavedRoomScrollAnchor = async (page: Page, dbName: string, roomId: string) => {
  return page.evaluate(
    ({ databaseName, targetRoomId }) =>
      new Promise<boolean>((resolve, reject) => {
        const request = indexedDB.open(databaseName)

        request.onerror = () => reject(request.error?.message ?? 'Failed to open IndexedDB')
        request.onsuccess = () => {
          const db = request.result
          const transaction = db.transaction('settings', 'readonly')
          const settingsRequest = transaction.objectStore('settings').get('settings')

          settingsRequest.onerror = () => reject(settingsRequest.error?.message ?? 'Failed to read settings')
          settingsRequest.onsuccess = () => {
            const settings = settingsRequest.result as {
              messageScrollByRoom?: Record<string, { mode?: string }>
            }

            db.close()
            resolve(settings.messageScrollByRoom?.[targetRoomId]?.mode === 'anchor')
          }
        }
      }),
    { databaseName: dbName, targetRoomId: roomId }
  )
}

const waitForSavedRoomScrollAnchor = async (page: Page, dbName: string, roomId: string) => {
  await expect
    .poll(() => hasSavedRoomScrollAnchor(page, dbName, roomId), { timeout: MESSAGE_SCROLL_SYNC_TIMEOUT_MS })
    .toBe(true)
}

const expectScrollRestored = async (viewport: Locator, expectedSnapshot: MessageScrollSnapshot) => {
  expect(expectedSnapshot.firstVisibleMessage).not.toBeNull()

  await expect
    .poll(
      async () => {
        const restoredSnapshot = await readVisibleMessageSnapshot(viewport)

        if (!restoredSnapshot.firstVisibleMessage || !expectedSnapshot.firstVisibleMessage) {
          return false
        }

        const hasSameAnchor = restoredSnapshot.firstVisibleMessage.text === expectedSnapshot.firstVisibleMessage.text
        const hasStableOffset =
          Math.abs(restoredSnapshot.firstVisibleMessage.top - expectedSnapshot.firstVisibleMessage.top) <
          MESSAGE_SCROLL_ANCHOR_OFFSET_TOLERANCE_PX

        return hasSameAnchor && hasStableOffset
      },
      { timeout: MESSAGE_SCROLL_SYNC_TIMEOUT_MS }
    )
    .toBe(true)
}

const reloadChatRoom = async (page: Page, title: string) => {
  await page.reload()
  await dismissFirstRunOverlays(page)
  await expect(page.getByPlaceholder(MESSAGE_SCROLL_SEARCH_PLACEHOLDER)).toBeVisible()
  await expect(page.getByRole('heading', { name: title })).toBeVisible()
  await waitForChatContentReady(page)
}

test.describe('message scroll position', () => {
  test.setTimeout(MESSAGE_SCROLL_TEST_TIMEOUT_MS)

  test('restores independent image-heavy chat positions after room switches and page reloads', async ({ page }) => {
    await openChatRoomsPage(page)
    const dbName = await getAppDbName(page)
    const productStudioRoomId = await openChatRoom(page, MESSAGE_SCROLL_CHAT_NAMES.productStudio)

    await waitForChatContentReady(page)

    const productStudioViewport = getMessagesScrollViewport(page)

    await scrollMessagesToRatio(productStudioViewport, MESSAGE_SCROLL_TARGET_RATIOS.productStudio)
    await waitForSavedRoomScrollAnchor(page, dbName, productStudioRoomId)

    const productStudioSnapshot = await readVisibleMessageSnapshot(productStudioViewport)

    expect(productStudioSnapshot.firstVisibleMessage).not.toBeNull()
    expect(productStudioSnapshot.scrollTop).toBeGreaterThan(0)

    const weekendHouseRoomId = await openChatRoom(page, MESSAGE_SCROLL_CHAT_NAMES.weekendHouse)

    await waitForChatContentReady(page)

    const weekendHouseViewport = getMessagesScrollViewport(page)

    await scrollMessagesToRatio(weekendHouseViewport, MESSAGE_SCROLL_TARGET_RATIOS.weekendHouse)
    await waitForSavedRoomScrollAnchor(page, dbName, weekendHouseRoomId)

    const weekendHouseSnapshot = await readVisibleMessageSnapshot(weekendHouseViewport)

    expect(weekendHouseSnapshot.firstVisibleMessage).not.toBeNull()
    expect(weekendHouseSnapshot.scrollTop).toBeGreaterThan(0)
    expect(weekendHouseSnapshot.firstVisibleMessage?.text).not.toBe(productStudioSnapshot.firstVisibleMessage?.text)

    await openChatRoom(page, MESSAGE_SCROLL_CHAT_NAMES.productStudio)
    await waitForChatContentReady(page)
    await expectScrollRestored(getMessagesScrollViewport(page), productStudioSnapshot)

    await openChatRoom(page, MESSAGE_SCROLL_CHAT_NAMES.weekendHouse)
    await waitForChatContentReady(page)
    await expectScrollRestored(getMessagesScrollViewport(page), weekendHouseSnapshot)

    await reloadChatRoom(page, MESSAGE_SCROLL_CHAT_NAMES.weekendHouse)
    await expectScrollRestored(getMessagesScrollViewport(page), weekendHouseSnapshot)

    await openChatRoom(page, MESSAGE_SCROLL_CHAT_NAMES.productStudio)
    await waitForChatContentReady(page)
    await expectScrollRestored(getMessagesScrollViewport(page), productStudioSnapshot)

    await reloadChatRoom(page, MESSAGE_SCROLL_CHAT_NAMES.productStudio)
    await expectScrollRestored(getMessagesScrollViewport(page), productStudioSnapshot)

    await openChatRoom(page, MESSAGE_SCROLL_CHAT_NAMES.weekendHouse)
    await waitForChatContentReady(page)
    await expectScrollRestored(getMessagesScrollViewport(page), weekendHouseSnapshot)
  })
})
