import { AppLanguageType, IUserInfoNotification } from 'common'

import { getActiveInfoNotifications } from './get-active-info-notifications'
import { getUserInfoNotificationMap } from './get-user-info-notification-map'

export const getUserActiveInfoNotifications = async (
  userId: string,
  language: AppLanguageType
): Promise<IUserInfoNotification[]> => {
  const infoNotificationMap = await getUserInfoNotificationMap(userId, language)
  const infoNotificationIds = Object.keys(infoNotificationMap)
  const activeInfoNotifications = await getActiveInfoNotifications({ ids: infoNotificationIds })

  return activeInfoNotifications.flatMap((notification) => {
    const status = infoNotificationMap[notification.id]

    if (!status) return []

    return [{ ...notification, status }]
  })
}
