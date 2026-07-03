import type { APP_BADGE_SERVICE_WORKER_SYNC_MESSAGE_TYPE } from '../config/service-worker-message.constants'

export type AppBadgeNavigator = Navigator & {
  clearAppBadge?: () => Promise<void>
  setAppBadge?: (contents?: number) => Promise<void>
}

export interface AppBadgeServiceWorkerSyncMessage {
  badgeCount: number
  type: typeof APP_BADGE_SERVICE_WORKER_SYNC_MESSAGE_TYPE
}
