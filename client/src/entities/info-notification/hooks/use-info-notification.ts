import { INFO_NOTIFICATION_MAP, INFO_NOTIFICATIONS_I18N } from 'src/entities/info-notification'
import { useI18n } from 'src/entities/settings'
import { useUser } from 'src/entities/user'

export const useInfoNotification = () => {
  const { infoNotifications } = useUser()
  const { t } = useI18n()

  const unreadInfoNotificationQuantity = Number(
    Object.values(infoNotifications)?.filter((status) => status === 'unread').length
  )

  const collapseInfoNotifications =
    Object.entries(INFO_NOTIFICATION_MAP)?.map(([id, info]) => ({
      id,
      title: t(info.title),
      content: info.content,
      badgeName: infoNotifications[Number(id)] === 'unread' ? t(INFO_NOTIFICATIONS_I18N.unreadBadge) : undefined
    })) ?? []

  const isRead = (id: number) => infoNotifications[id] === 'read'

  return { collapseInfoNotifications, unreadInfoNotificationQuantity, isRead }
}
