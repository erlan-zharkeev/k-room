import type { IEventAuthError, IEventErrorMessage, SocketActionsType } from 'global-shared'

import { ERROR_TOAST_LIFE_MS, TOAST_I18N } from 'src/shared/config'
import { translate } from 'src/shared/lib'
import { useAppToast } from 'src/shared/lib/notification'

import { socket } from './socket'
import { setSocketConnected, setSocketReconnecting } from './socket-status'
import { useSocketConnect } from './use-socket-connect'
import { useSocketReconnect } from './use-socket-reconnect'

let isMonitorActive = false

export const useSocketConnectionMonitor = () => {
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

    socket.on<SocketActionsType>('disconnect', () => {
      setSocketConnected(false)
    })

    socket.on<SocketActionsType>('error-message', ({ message }: IEventErrorMessage) => {
      toast.add({
        type: 'error',
        title: translate(TOAST_I18N.error),
        content: message,
        duration: ERROR_TOAST_LIFE_MS
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
