import { InfoNotificationMapType, WELCOME_INFO_NOTIFICATION_ID } from 'common'

import { getActiveInfoNotifications } from './get-active-info-notifications'

export const getInitialInfoNotificationMap = async (createdAfter: number = Date.now()): Promise<InfoNotificationMapType> => {
  const notifications = await getActiveInfoNotifications({ createdAfter })
  const result: InfoNotificationMapType = {
    [WELCOME_INFO_NOTIFICATION_ID]: 'unread'
  }

  notifications.forEach(({ id }) => {
    result[id] = 'unread'
  })

  return result
}
