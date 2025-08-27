import { UserEndpointsEnum } from 'common-types'

import { useUser } from 'src/entities/user'

import { useApi } from 'src/shared/api'

export const useMarkInfoNotificationAsRead = () => {
  const { doRequest } = useApi()
  const { setByPath } = useUser()

  const markAsRead = async (id: number) => {
    await doRequest('patch', UserEndpointsEnum.MarkInfoNotificationAsRead, { id })
    setByPath(`infoNotifications.${id}`, 'read')
  }

  return { markAsRead }
}
