import { useEffect } from 'react'

import { useDispatch } from 'react-redux'

import { useSocketReconnect } from 'src/features/socket'

import { ClientNotificationMessage, useNotification } from 'src/entities/notification'
import { setOnline } from 'src/entities/system'

import { socket } from 'src/shared/api'

export const useNetworkMonitor = () => {
  const { socketReconnect } = useSocketReconnect()
  const notifications = useNotification()
  const dispatch = useDispatch()

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
    dispatch(setOnline(false))
  }

  const handleOnline = () => {
    socketReconnect()
    networkOnlineNotification.open()
    dispatch(setOnline(true))
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
