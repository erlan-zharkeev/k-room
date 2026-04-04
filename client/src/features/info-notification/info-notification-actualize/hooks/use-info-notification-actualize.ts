import { IEventInfoNotificationStatusUpdated, SocketActionsType, IUserInfoNotification } from 'common'

import { useInfoNotification } from 'src/entities/info-notification'

import { socket } from 'src/shared/api'

export const useInfoNotificationActualize = () => {
  const { bulkPutInfoNotifications, updateInfoNotificationStatus } = useInfoNotification()

  const actualizeInfoNotifications = async (notifications: IUserInfoNotification[]) => {
    await bulkPutInfoNotifications(notifications)
  }

  const handleInfoNotificationStatusUpdate = async ({ id, status }: IEventInfoNotificationStatusUpdated) => {
    await updateInfoNotificationStatus(id, status)
  }

  const monitorInfoNotificationsActualize = () => {
    socket.on<SocketActionsType>('actual-info-notifications', actualizeInfoNotifications)
    socket.on<SocketActionsType>('info-notification-status-updated', handleInfoNotificationStatusUpdate)

    return () => {
      socket.off<SocketActionsType>('actual-info-notifications', actualizeInfoNotifications)
      socket.off<SocketActionsType>('info-notification-status-updated', handleInfoNotificationStatusUpdate)
    }
  }

  return { monitorInfoNotificationsActualize }
}
