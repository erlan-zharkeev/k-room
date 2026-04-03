import { InfoNotificationMapType } from 'common'

import { getActiveInfoNotifications } from './get-active-info-notifications'

export const getInitialInfoNotificationMap = async (): Promise<InfoNotificationMapType> => {
  const notifications = await getActiveInfoNotifications()
  const result: InfoNotificationMapType = {}

  notifications.forEach(({ id }) => {
    result[id] = 'unread'
  })

  return result
}
