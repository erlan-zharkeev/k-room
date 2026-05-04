import type { AppNotificationPlacementType, AppNotificationType } from './types'

export const DEFAULT_NOTIFICATION_WIDTH = '330px'
export const DEFAULT_NOTIFICATION_DURATION = 3000

export const DEFAULT_NOTIFICATION_PLACEMENT: AppNotificationPlacementType = 'top-right'

export const NOTIFICATION_PLACEMENT_BY_TYPE: Record<AppNotificationType, AppNotificationPlacementType> = {
  success: 'top-right',
  info: 'top-right',
  warning: 'top-right',
  error: 'top-center'
}
