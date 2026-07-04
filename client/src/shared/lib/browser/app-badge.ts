import type { AppBadgeNavigator, AppBadgeServiceWorkerSyncMessage } from './app-badge.types'
import { getClientPlatform } from './browser'
import { APP_BADGE_SERVICE_WORKER_SYNC_MESSAGE_TYPE } from './service-worker-message.constants'

const getBrowserAppBadgeNavigator = () => {
  const badgeNavigator = navigator as AppBadgeNavigator

  if (!badgeNavigator.setAppBadge || !badgeNavigator.clearAppBadge) return null

  return badgeNavigator
}

const syncBrowserAppBadgeServiceWorker = async (badgeCount: number) => {
  if (!('serviceWorker' in navigator)) return

  const message: AppBadgeServiceWorkerSyncMessage = {
    badgeCount,
    type: APP_BADGE_SERVICE_WORKER_SYNC_MESSAGE_TYPE
  }
  const serviceWorker =
    navigator.serviceWorker.controller ?? (await navigator.serviceWorker.getRegistration('/'))?.active

  serviceWorker?.postMessage(message)
}

const syncBrowserAppBadge = async (badgeCount: number) => {
  await syncBrowserAppBadgeServiceWorker(badgeCount)

  const badgeNavigator = getBrowserAppBadgeNavigator()

  if (!badgeNavigator) return

  if (badgeCount > 0) {
    await badgeNavigator.setAppBadge(badgeCount)
    return
  }

  await badgeNavigator.clearAppBadge()
}

export const syncAppBadge = async (badgeCount: number) => {
  try {
    if (getClientPlatform() !== 'browser') return

    await syncBrowserAppBadge(badgeCount)
  } catch (error) {
    void error
  }
}
