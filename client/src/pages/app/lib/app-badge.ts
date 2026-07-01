import { getClientPlatform } from 'src/shared/lib'

import type { AppBadgeNavigator } from './app-badge.types'

const getBrowserAppBadgeNavigator = () => {
  const badgeNavigator = navigator as AppBadgeNavigator

  if (!badgeNavigator.setAppBadge || !badgeNavigator.clearAppBadge) return null

  return badgeNavigator
}

const syncBrowserAppBadge = async (unreadMessagesQuantity: number) => {
  const badgeNavigator = getBrowserAppBadgeNavigator()

  if (!badgeNavigator) return

  if (unreadMessagesQuantity > 0) {
    await badgeNavigator.setAppBadge(unreadMessagesQuantity)
    return
  }

  await badgeNavigator.clearAppBadge()
}

const syncNativeAppBadge = async (unreadMessagesQuantity: number) => {
  const { getCurrentWindow } = await import('@tauri-apps/api/window')
  const window = getCurrentWindow()

  if (unreadMessagesQuantity > 0) {
    await window.setBadgeCount(unreadMessagesQuantity)
    return
  }

  await window.setBadgeCount(undefined)
}

export const syncAppBadge = async (unreadMessagesQuantity: number) => {
  try {
    const clientPlatform = getClientPlatform()

    if (clientPlatform === 'browser') {
      await syncBrowserAppBadge(unreadMessagesQuantity)
      return
    }

    await syncNativeAppBadge(unreadMessagesQuantity)
  } catch (error) {
    void error
  }
}
