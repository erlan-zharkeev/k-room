import type { SocketActionsType } from 'global-shared'

import { socket } from './socket'
import { setSocketConnected, setSocketReconnecting } from './socket-status'

export const useSocketConnect = () => {
  const actualizeSocketData = () => {
    if (!socket.connected) return

    socket.emit<SocketActionsType>('initialize')
    socket.emit<SocketActionsType>('actualize-user-data')
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
