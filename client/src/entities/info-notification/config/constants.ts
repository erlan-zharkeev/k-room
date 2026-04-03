import { WELCOME_INFO_NOTIFICATION_ID } from 'common'

import { IInfoNotificationItem, WelcomeInfoNotification, INFO_NOTIFICATIONS_I18N } from 'src/entities/info-notification'

export const INFO_ITEM_MARK_AS_READ_DURATION = 1.5 * 1000

export const INFO_NOTIFICATION_MAP: Record<string, IInfoNotificationItem> = {
  [WELCOME_INFO_NOTIFICATION_ID]: {
    id: WELCOME_INFO_NOTIFICATION_ID,
    title: INFO_NOTIFICATIONS_I18N.welcomeTitle,
    content: WelcomeInfoNotification
  }
}
