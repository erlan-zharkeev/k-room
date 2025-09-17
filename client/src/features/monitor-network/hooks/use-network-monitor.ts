import { useEffect } from 'react'

import { useDispatch } from 'react-redux'

import { useLogout } from 'src/features/auth'
import { useSocketReconnect } from 'src/features/socket'
import { useSwitchMainLoader } from 'src/features/switch-main-loader'

import { NOTIFICATION_MESSAGE, useNotification } from 'src/entities/notification'
import { setOnline, useSystem } from 'src/entities/system'

import { socket } from 'src/shared/api'

export const useNetworkMonitor = () => {
  const { socketReconnect } = useSocketReconnect()
  const notifications = useNotification()
  const { auth } = useSystem()
  const dispatch = useDispatch()
  const { logout } = useLogout()
  const { switchMainLoader } = useSwitchMainLoader()

  const networkOfflineNotification = notifications.getNotification({
    message: NOTIFICATION_MESSAGE.networkOffline(),
    messageType: 'error'
  })

  const networkOnlineNotification = notifications.getNotification({
    message: NOTIFICATION_MESSAGE.networkOnline(),
    messageType: 'info'
  })

  const handleOffline = () => {
    socket.disconnect()
    networkOfflineNotification.open()
    dispatch(setOnline(false))
  }

  const handleOnline = async () => {
    const logoutStatus = localStorage.getItem('logout-status')
    if (logoutStatus === 'failed' && auth === 'unauthorized') {
      switchMainLoader('show')
      await logout()
      switchMainLoader('hide')
      return
    }
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
