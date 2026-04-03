import { IInfoNotification } from 'common'

import { getUserInfoNotificationMap } from 'src/entities/info-notification-state'

import { getActiveInfoNotifications } from './get-active-info-notifications'

export const getUserActiveInfoNotifications = async (userId: string): Promise<IInfoNotification[]> => {
  const infoNotificationMap = await getUserInfoNotificationMap(userId)
  const infoNotificationIds = Object.keys(infoNotificationMap)

  return await getActiveInfoNotifications({ ids: infoNotificationIds })
}
