import { UserEndpointsEnum } from 'common'

import { useInfoNotification } from 'src/entities/info-notification'
import { useUser } from 'src/entities/user'

import { useApi } from 'src/shared/api'

export const useMarkInfoNotificationAsRead = () => {
  const { doRequest } = useApi()
  const { setByPath } = useUser()
  const { isRead } = useInfoNotification()

  const markAsRead = async (id: number) => {
    if (isRead(id)) return
    await doRequest('patch', UserEndpointsEnum.MarkInfoNotificationAsRead, { id })
    setByPath(`infoNotifications.${id}`, 'read')
  }

  return { markAsRead }
}
