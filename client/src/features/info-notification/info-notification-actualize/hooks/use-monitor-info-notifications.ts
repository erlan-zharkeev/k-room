import { IEventInfoNotificationStatusUpdated, SocketActionsType } from 'common'

import { useInfoNotification } from 'src/entities/info-notification'

import { socket } from 'src/shared/api'

export const useMonitorInfoNotifications = () => {
  const { bulkGet, put, bulkPut, update } = useInfoNotification()

  const merge = async (payload: Parameters<typeof bulkPut>[0]) => {
    if (!payload.length) return

    const existingInfoNotifications = await bulkGet(payload.map(({ id }) => id))
    const infoNotificationsToUpsert = payload.filter((notification, index) => {
      const existingInfoNotification = existingInfoNotifications[index]

      if (!existingInfoNotification) return true

      return (
        existingInfoNotification.status !== notification.status ||
        existingInfoNotification.isActive !== notification.isActive ||
        existingInfoNotification.updatedAt !== notification.updatedAt
      )
    })

    if (!infoNotificationsToUpsert.length) return

    await bulkPut(infoNotificationsToUpsert)
  }

  const updateStatus = ({ id, status }: IEventInfoNotificationStatusUpdated) => {
    return update(id, { status })
  }

  const monitorInfoNotifications = () => {
    socket.on<SocketActionsType>('actual-info-notifications', merge)
    socket.on<SocketActionsType>('info-notification-received', put)
    socket.on<SocketActionsType>('info-notification-status-updated', updateStatus)

    return () => {
      socket.off<SocketActionsType>('actual-info-notifications', merge)
      socket.off<SocketActionsType>('info-notification-received', put)
      socket.off<SocketActionsType>('info-notification-status-updated', updateStatus)
    }
  }

  return { monitorInfoNotifications }
}
