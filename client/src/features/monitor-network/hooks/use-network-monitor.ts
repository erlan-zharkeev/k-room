import { useEffect } from 'react'

import { useDispatch } from 'react-redux'

import { useLogout } from 'src/features/auth'
import { useSocketReconnect } from 'src/features/socket'
import { useMainLoader } from 'src/features/switch-main-loader'

import { NOTIFICATION_I18N, useNotification } from 'src/entities/notification'
import { useI18n } from 'src/entities/settings'
import { setOnline, useSystem } from 'src/entities/system'

import { socket } from 'src/shared/api'
import { LOCAL_STORAGE_KEY } from 'src/shared/config'

export const useNetworkMonitor = () => {
  const { socketReconnect } = useSocketReconnect()
  const notifications = useNotification()
  const { t } = useI18n()
  const { auth } = useSystem()
  const dispatch = useDispatch()
  const { logout } = useLogout()
  const { switchMainLoader } = useMainLoader()

  const networkOfflineNotification = notifications.getNotification({
    message: t(NOTIFICATION_I18N.networkOffline),
    messageType: 'error'
  })

  const networkOnlineNotification = notifications.getNotification({
    message: t(NOTIFICATION_I18N.networkOnline),
    messageType: 'info'
  })

  const handleOffline = () => {
    socket.disconnect()
    networkOfflineNotification.open()
    dispatch(setOnline(false))
  }

  const handleOnline = async () => {
    const logoutStatus = localStorage.getItem(LOCAL_STORAGE_KEY.LogoutStatus)
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
