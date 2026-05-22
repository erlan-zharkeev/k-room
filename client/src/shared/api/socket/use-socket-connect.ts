import type { SocketActions } from 'global-shared'

import { socket } from './socket'
import { setSocketConnected, setSocketReconnecting } from './socket-status'

export const useSocketConnect = () => {
  const actualizeSocketData = () => {
    if (!socket.connected) return

    socket.emit<SocketActions>('initialize')
    socket.emit<SocketActions>('actualize-user-data')
  }

  const socketConnect = () => {
    if (!socket.connected) {
      socket.connect()
    }

    setSocketConnected(socket.connected)
    setSocketReconnecting(false)
  }

  return {
    actualizeSocketData,
    socketConnect
  }
}
