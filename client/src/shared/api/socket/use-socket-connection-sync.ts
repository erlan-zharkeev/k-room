import type { EventAuthError, EventErrorMessage } from 'global-shared'

import { TOAST_I18N, useAppToast, useI18n } from 'src/shared/lib'

import { socket } from './socket'
import { stopSocketDataLoading } from './socket-data-status'
import { setSocketConnected, setSocketReconnectFailed, setSocketReconnecting } from './socket-status'
import { useSocketConnect } from './use-socket-connect'
import { useSocketReconnect } from './use-socket-reconnect'
import { useSocketTransportErrorToast } from './use-socket-transport-error-toast'

export const useSocketConnectionSync = () => {
  const { t } = useI18n()
  const toast = useAppToast()
  const { actualizeSocketData } = useSocketConnect()
  const { socketReconnect } = useSocketReconnect()
  const { hideSocketTransportErrorToast } = useSocketTransportErrorToast()

  const syncSocketConnected = () => {
    setSocketConnected(true)
    setSocketReconnectFailed(false)
    setSocketReconnecting(false)
    hideSocketTransportErrorToast()
    actualizeSocketData()
  }

  const syncSocketDisconnected = () => {
    setSocketConnected(false)
    stopSocketDataLoading()
  }

  const showSocketErrorMessage = ({ message, silent }: EventErrorMessage) => {
    if (silent) return

    toast.add({
      type: 'error',
      title: t(TOAST_I18N.error),
      content: message
    })
  }

  const syncSocketAuthError = async ({ event, payload }: EventAuthError) => {
    await socketReconnect()

    if (event === 'connection') return

    socket.emit(event, payload as never)
  }

  const syncSocketReconnectAttempt = () => {
    setSocketReconnectFailed(false)
    setSocketReconnecting(true)
  }

  const syncSocketReconnectFailed = () => {
    setSocketReconnectFailed(true)
    setSocketReconnecting(false)
    stopSocketDataLoading()
  }

  return {
    syncSocketConnected,
    syncSocketDisconnected,
    showSocketErrorMessage,
    syncSocketAuthError,
    syncSocketReconnectAttempt,
    syncSocketReconnectFailed
  }
}
