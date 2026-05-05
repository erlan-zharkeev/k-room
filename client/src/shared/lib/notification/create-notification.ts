import { DEFAULT_NOTIFICATION_PLACEMENT, NOTIFICATION_PLACEMENT_BY_TYPE } from './constants'
import type { IAppNotification, IAppNotificationInput } from './types'

export const createNotification = (message: IAppNotificationInput): IAppNotification => {
  const type = message.type ?? 'info'

  return {
    ...message,
    type,
    placement: message.placement ?? NOTIFICATION_PLACEMENT_BY_TYPE[type] ?? DEFAULT_NOTIFICATION_PLACEMENT
  }
}
