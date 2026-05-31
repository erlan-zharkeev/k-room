import type { EventAuthError, EventErrorMessage, SocketActions } from 'global-shared'

import { TOAST_I18N } from 'src/shared/lib'
import { useI18n } from 'src/shared/lib'
import { useAppToast } from 'src/shared/lib'

import { socket } from './socket'
import { setSocketConnected, setSocketReconnecting } from './socket-status'
import { useSocketConnect } from './use-socket-connect'
import { useSocketReconnect } from './use-socket-reconnect'

let isMonitorActive = false
let disposeSocketConnectionMonitorListeners: (() => void) | null = null

export const useSocketConnectionMonitor = () => {
  const { t } = useI18n()
  const toast = useAppToast()
  const { actualizeSocketData } = useSocketConnect()
  const { socketReconnect } = useSocketReconnect()

  const initializeSocketConnectionMonitor = () => {
    if (isMonitorActive) return

    isMonitorActive = true

    const handleConnect = () => {
      setSocketConnected(true)
      setSocketReconnecting(false)
      actualizeSocketData()
    }

    const handleDisconnect = () => {
      setSocketConnected(false)
    }

    const handleErrorMessage = ({ message, silent }: EventErrorMessage) => {
      if (silent) return

      toast.add({
        type: 'error',
        title: t(TOAST_I18N.error),
        content: message
      })
    }

    const handleAuthError = async ({ event, payload }: EventAuthError) => {
      await socketReconnect()
      socket.emit(event, payload)
    }

    const handleReconnect = () => {
      setSocketConnected(true)
      setSocketReconnecting(false)
      actualizeSocketData()
    }

    const handleReconnectAttempt = () => {
      setSocketReconnecting(true)
    }

    const handleReconnectFailed = () => {
      setSocketReconnecting(false)
    }

    socket.on('connect', handleConnect)
    socket.on<SocketActions>('disconnect', handleDisconnect)
    socket.on<SocketActions>('error-message', handleErrorMessage)
    socket.on<SocketActions>('auth-error', handleAuthError)
    socket.io.on('reconnect', handleReconnect)
    socket.io.on('reconnect_attempt', handleReconnectAttempt)
    socket.io.on('reconnect_failed', handleReconnectFailed)

    disposeSocketConnectionMonitorListeners = () => {
      socket.off('connect', handleConnect)
      socket.off<SocketActions>('disconnect', handleDisconnect)
      socket.off<SocketActions>('error-message', handleErrorMessage)
      socket.off<SocketActions>('auth-error', handleAuthError)
      socket.io.off('reconnect', handleReconnect)
      socket.io.off('reconnect_attempt', handleReconnectAttempt)
      socket.io.off('reconnect_failed', handleReconnectFailed)
    }
  }

  const disposeSocketConnectionMonitor = () => {
    disposeSocketConnectionMonitorListeners?.()
    disposeSocketConnectionMonitorListeners = null
    isMonitorActive = false
  }

  return {
    initializeSocketConnectionMonitor,
    disposeSocketConnectionMonitor
  }
}
