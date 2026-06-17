import { socket } from './socket'
import { useSocketConnectionSync } from './use-socket-connection-sync.model'

let isMonitorActive = false
let disposeSocketConnectionMonitorListeners: (() => void) | null = null

export const useSocketConnectionMonitor = () => {
  const {
    syncSocketConnected,
    syncSocketDisconnected,
    showSocketErrorMessage,
    syncSocketAuthError,
    syncSocketReconnectAttempt,
    syncSocketReconnectFailed
  } = useSocketConnectionSync()

  const initializeSocketConnectionMonitor = () => {
    if (isMonitorActive) return

    isMonitorActive = true

    socket.on('connect', syncSocketConnected)
    socket.on('disconnect', syncSocketDisconnected)
    socket.on('error-message', showSocketErrorMessage)
    socket.on('auth-error', syncSocketAuthError)
    socket.io.on('reconnect', syncSocketConnected)
    socket.io.on('reconnect_attempt', syncSocketReconnectAttempt)
    socket.io.on('reconnect_failed', syncSocketReconnectFailed)

    disposeSocketConnectionMonitorListeners = () => {
      socket.off('connect', syncSocketConnected)
      socket.off('disconnect', syncSocketDisconnected)
      socket.off('error-message', showSocketErrorMessage)
      socket.off('auth-error', syncSocketAuthError)
      socket.io.off('reconnect', syncSocketConnected)
      socket.io.off('reconnect_attempt', syncSocketReconnectAttempt)
      socket.io.off('reconnect_failed', syncSocketReconnectFailed)
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
