import { registerSocketEventListeners } from './event-listeners'
import { socket } from './socket'
import { useSocketConnectionSync } from './use-socket-connection-sync'

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

    const disposeSocketListeners = registerSocketEventListeners([
      ['connect', syncSocketConnected],
      ['disconnect', syncSocketDisconnected],
      ['error-message', showSocketErrorMessage],
      ['auth-error', syncSocketAuthError]
    ])
    socket.io.on('reconnect', syncSocketConnected)
    socket.io.on('reconnect_attempt', syncSocketReconnectAttempt)
    socket.io.on('reconnect_failed', syncSocketReconnectFailed)

    disposeSocketConnectionMonitorListeners = () => {
      disposeSocketListeners()
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
