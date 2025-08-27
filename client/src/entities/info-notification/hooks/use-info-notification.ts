import { useMemo } from 'react'

import { useUser } from 'src/entities/user'

import { INFO_NOTIFICATION_MAP } from '../config'

export const useInfoNotification = () => {
  const { infoNotifications } = useUser()

  const unreadInfoNotificationQuantity = useMemo(
    () => Number(Object.values(infoNotifications)?.filter((status) => status === 'unread').length),
    [infoNotifications]
  )

  const collapseInfoNotifications = useMemo(() => {
    const result =
      Object.entries(INFO_NOTIFICATION_MAP)?.map(([id, info]) => ({
        id,
        title: info.title,
        content: info.content,
        badgeName: infoNotifications[Number(id)] === 'unread' ? 'Unread' : undefined
      })) ?? []
    return result
  }, [infoNotifications])

  return { collapseInfoNotifications, unreadInfoNotificationQuantity }
}
