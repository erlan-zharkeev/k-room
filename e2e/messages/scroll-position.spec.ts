import { expect, test, type Locator, type Page } from '@playwright/test'

import { LOGIN_FIXTURE_USER } from 'e2e/auth/constants'
import { dismissFirstRunOverlays } from 'e2e/shared/app'
import { loginByCredentials } from 'e2e/shared/auth'

import {
  MESSAGE_SCROLL_CHAT_NAMES,
  MESSAGE_SCROLL_PAGE_PATH,
  MESSAGE_SCROLL_SEARCH_PLACEHOLDER,
  MESSAGE_SCROLL_SYNC_TIMEOUT_MS,
  MESSAGE_SCROLL_TEST_TIMEOUT_MS
} from './scroll-position.constants'

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
}

const waitForImageMessages = async (page: Page) => {
  await expect(page.locator('.message-media-gallery').first()).toBeVisible({
    timeout: MESSAGE_SCROLL_SYNC_TIMEOUT_MS
  })
}

const readVisibleMessageSnapshot = async (viewport: Locator) => {
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

const scrollMessagesToMiddle = async (viewport: Locator) => {
  await viewport.evaluate((scrollElement) => {
    scrollElement.scrollTop = Math.max((scrollElement.scrollHeight - scrollElement.clientHeight) * 0.45, 0)
    scrollElement.dispatchEvent(new Event('scroll', { bubbles: true }))
  })
}

test.describe('message scroll position', () => {
  test.setTimeout(MESSAGE_SCROLL_TEST_TIMEOUT_MS)

  test('restores image-heavy chat scroll position after switching rooms', async ({ page }) => {
    await openChatRoomsPage(page)
    await openChatRoom(page, MESSAGE_SCROLL_CHAT_NAMES.productStudio)
    await waitForImageMessages(page)

    const productStudioViewport = getMessagesScrollViewport(page)

    await scrollMessagesToMiddle(productStudioViewport)
    await page.waitForTimeout(800)

    const beforeSwitch = await readVisibleMessageSnapshot(productStudioViewport)

    expect(beforeSwitch.firstVisibleMessage).not.toBeNull()
    expect(beforeSwitch.scrollTop).toBeGreaterThan(0)

    await openChatRoom(page, MESSAGE_SCROLL_CHAT_NAMES.weekendHouse)
    await waitForImageMessages(page)
    await openChatRoom(page, MESSAGE_SCROLL_CHAT_NAMES.productStudio)
    await waitForImageMessages(page)

    const restoredViewport = getMessagesScrollViewport(page)

    await expect
      .poll(
        async () => {
          const restored = await readVisibleMessageSnapshot(restoredViewport)

          if (!restored.firstVisibleMessage || !beforeSwitch.firstVisibleMessage) {
            return false
          }

          const hasSameAnchor = restored.firstVisibleMessage.text === beforeSwitch.firstVisibleMessage.text
          const hasStableOffset = Math.abs(restored.firstVisibleMessage.top - beforeSwitch.firstVisibleMessage.top) < 36

          return hasSameAnchor && hasStableOffset
        },
        { timeout: MESSAGE_SCROLL_SYNC_TIMEOUT_MS }
      )
      .toBe(true)
  })
})
