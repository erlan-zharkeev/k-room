import { SocketActionsType } from 'common'

import { useInfoNotification } from 'src/entities/info-notification'

import { socket } from 'src/shared/api'

export const useMonitorInfoNotifications = () => {
  const { mergeInfoNotifications, putInfoNotification, updateInfoNotificationStatus } = useInfoNotification()

  const monitorInfoNotifications = () => {
    socket.on<SocketActionsType>('actual-info-notifications', mergeInfoNotifications)
    socket.on<SocketActionsType>('info-notification-received', putInfoNotification)
    socket.on<SocketActionsType>('info-notification-status-updated', updateInfoNotificationStatus)

    return () => {
      socket.off<SocketActionsType>('actual-info-notifications', mergeInfoNotifications)
      socket.off<SocketActionsType>('info-notification-received', putInfoNotification)
      socket.off<SocketActionsType>('info-notification-status-updated', updateInfoNotificationStatus)
    }
  }

  return { monitorInfoNotifications }
}
