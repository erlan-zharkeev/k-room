import { socket, useSocket } from 'src/shared/api'
import { ClientNotificationMessage, useNotification } from 'src/entities/notification'

export const useNetworkMonitor = () => {
  const { socketReconnect } = useSocket()
  const notifications = useNotification()

  const networkOfflineNotification = notifications.getNotification({
    message: ClientNotificationMessage.NetworkOffline,
    messageType: 'error'
  })
  const networkOnlineNotification = notifications.getNotification({
    message: ClientNotificationMessage.NetworkOnline,
    messageType: 'info'
  })
  const handleOffline = () => {
    socket.disconnect()
    networkOfflineNotification.open()
  }
  const handleOnline = () => {
    socketReconnect()
    networkOnlineNotification.open()
  }

  const monitorNetwork = () => {
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
  }

  return {
    monitorNetwork
  }
}
