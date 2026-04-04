import { SocketActionsType } from 'common'

import { useInfoNotification } from 'src/entities/info-notification'

import { socket } from 'src/shared/api'

export const useMonitorInfoNotifications = () => {
  const { merge, put, updateStatus } = useInfoNotification()

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
