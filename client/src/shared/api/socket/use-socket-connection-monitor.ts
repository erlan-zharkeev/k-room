import type { IEventAuthError, IEventErrorMessage, SocketActionsType } from 'global-shared'
import { useToast } from 'primevue/usetoast'

import { ERROR_TOAST_LIFE_MS, TOAST_I18N } from 'src/shared/config'
import { useI18n } from 'src/shared/lib'

import { socket } from './socket'
import { setSocketConnected, setSocketReconnecting } from './socket-status'
import { useSocketConnect } from './use-socket-connect'
import { useSocketReconnect } from './use-socket-reconnect'

let isMonitorActive = false

export const useSocketConnectionMonitor = () => {
  const toast = useToast()
  const { t } = useI18n()
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

    socket.on<SocketActionsType>('disconnect', () => {
      setSocketConnected(false)
    })

    socket.on<SocketActionsType>('error-message', ({ message }: IEventErrorMessage) => {
      toast.add({
        severity: 'error',
        summary: t(TOAST_I18N.error),
        detail: message,
        life: ERROR_TOAST_LIFE_MS
      })
    })

    socket.on<SocketActionsType>('auth-error', async ({ event, payload }: IEventAuthError) => {
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
