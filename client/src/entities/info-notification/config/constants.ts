import { WelcomeInfoNotification } from 'src/entities/info-notification'
import { INFO_NOTIFICATIONS_I18N } from 'src/entities/info-notification/config/i18n'
import { type IInfoNotificationItem } from 'src/entities/info-notification/config/types'

export const INFO_ITEM_MARK_AS_READ_DURATION = 1.5 * 1000

export const INFO_NOTIFICATION_MAP: Record<number, IInfoNotificationItem> = {
  1: {
    id: 1,
    title: INFO_NOTIFICATIONS_I18N.welcomeTitle,
    content: WelcomeInfoNotification
  }
}
