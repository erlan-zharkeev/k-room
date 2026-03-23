import { INFO_NOTIFICATION_MAP } from 'src/entities/info-notification'
import { useUser } from 'src/entities/user'

export const useInfoNotification = () => {
  const { infoNotifications } = useUser()

  const unreadInfoNotificationQuantity = Number(Object.values(infoNotifications)?.filter((status) => status === 'unread').length)

  const collapseInfoNotifications = Object.entries(INFO_NOTIFICATION_MAP)?.map(([id, info]) => ({
    id,
    title: info.title,
    content: info.content,
    badgeName: infoNotifications[Number(id)] === 'unread' ? 'Unread' : undefined
  })) ?? []

  const isRead = (id: number) => infoNotifications[id] === 'read'

  return { collapseInfoNotifications, unreadInfoNotificationQuantity, isRead }
}
