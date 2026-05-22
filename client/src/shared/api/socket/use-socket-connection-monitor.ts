import type { EventAuthError, EventErrorMessage, SocketActions } from 'global-shared'

import { TOAST_I18N } from 'src/shared/lib'
import { useI18n } from 'src/shared/lib'
import { useAppToast } from 'src/shared/lib'

import { socket } from './socket'
import { setSocketConnected, setSocketReconnecting } from './socket-status'
import { useSocketConnect } from './use-socket-connect'
import { useSocketReconnect } from './use-socket-reconnect'

let isMonitorActive = false

export const useSocketConnectionMonitor = () => {
  const { t } = useI18n()
  const toast = useAppToast()
  const { actualizeSocketData } = useSocketConnect()
  const { socketReconnect } = useSocketReconnect()

  const initializeSocketConnectionMonitor = () => {
    if (isMonitorActive) return

    isMonitorActive = true

    socket.on('connect', () => {
      setSocketConnected(true)
      setSocketReconnecting(false)
      actualizeSocketData()
    })

    socket.on<SocketActions>('disconnect', () => {
      setSocketConnected(false)
    })

    socket.on<SocketActions>('error-message', ({ message }: EventErrorMessage) => {
      toast.add({
        type: 'error',
        title: t(TOAST_I18N.error),
        content: message
      })
    })

    socket.on<SocketActions>('auth-error', async ({ event, payload }: EventAuthError) => {
      await socketReconnect()
      socket.emit(event, payload)
    })

    socket.io.on('reconnect', () => {
      setSocketConnected(true)
      setSocketReconnecting(false)
      actualizeSocketData()
    })

    socket.io.on('reconnect_attempt', () => {
      setSocketReconnecting(true)
    })

    socket.io.on('reconnect_failed', () => {
      setSocketReconnecting(false)
    })
  }

  const disposeSocketConnectionMonitor = () => {
    socket.removeAllListeners()
    socket.io.removeAllListeners()
    isMonitorActive = false
  }

  return {
    initializeSocketConnectionMonitor,
    disposeSocketConnectionMonitor
  }
}
