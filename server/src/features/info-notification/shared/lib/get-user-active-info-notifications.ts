import { IUserInfoNotification } from 'common'

import { getUserInfoNotificationMap } from 'src/entities/info-notification-state'

import { getActiveInfoNotifications } from './get-active-info-notifications'

export const getUserActiveInfoNotifications = async (userId: string): Promise<IUserInfoNotification[]> => {
  const infoNotificationMap = await getUserInfoNotificationMap(userId)
  const infoNotificationIds = Object.keys(infoNotificationMap)
  const infoNotifications = await getActiveInfoNotifications({ ids: infoNotificationIds })

  return infoNotifications.flatMap((notification) => {
    const status = infoNotificationMap[notification.id]

    if (!status) return []

    return [{ ...notification, status }]
  })
}
