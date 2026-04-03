import { SocketActionsType, IInfoNotification } from 'common'

import { useInfoNotification } from 'src/entities/info-notification'

import { socket } from 'src/shared/api'

export const useInfoNotificationActualize = () => {
  const { bulkPutInfoNotifications } = useInfoNotification()

  const actualizeInfoNotifications = async (notifications: IInfoNotification[]) => {
    await bulkPutInfoNotifications(notifications)
  }

  const monitorInfoNotificationsActualize = () => {
    socket.on<SocketActionsType>('actual-info-notifications', actualizeInfoNotifications)
  }

  return { monitorInfoNotificationsActualize }
}
