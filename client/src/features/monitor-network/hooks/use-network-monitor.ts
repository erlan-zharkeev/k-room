import { useEffect } from 'react'

import { ClientNotificationMessage, useNotification } from 'src/entities/notification'

import { socket, useSocket } from 'src/shared/api'

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

  const unsubscribeMonitorNetwork = () => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
  }

  useEffect(() => {
    monitorNetwork()

    return () => {
      unsubscribeMonitorNetwork()
    }
  }, [])
}
