import { USER_ENDPOINTS } from 'common'

import { useInfoNotification } from 'src/entities/info-notification'
import { useUser } from 'src/entities/user'

import { useApi } from 'src/shared/api'

export const useMarkInfoNotificationAsRead = () => {
  const { doRequest } = useApi()
  const { setByPath } = useUser()
  const { isRead } = useInfoNotification()

  const markAsRead = async (id: string) => {
    try {
      if (isRead(id)) return
      await doRequest('patch', USER_ENDPOINTS.markInfoNotificationAsRead, { id })
      setByPath(`infoNotifications.${id}`, 'read')
    } catch {}
  }

  return { markAsRead }
}
