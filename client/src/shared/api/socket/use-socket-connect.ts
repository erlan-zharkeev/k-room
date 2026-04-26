import type { SocketActionsType } from 'global-shared'

import { currentLanguage } from 'src/shared/lib'

import { socket } from './socket'
import { setSocketConnected, setSocketReconnecting } from './socket-status'

export const useSocketConnect = () => {
  const actualizeSocketData = () => {
    socket.emit<SocketActionsType>('initialize')
    socket.emit<SocketActionsType>('actualize-user-data')
  }

  const socketConnect = () => {
    socket.auth = {
      language: currentLanguage.value
    }

    if (!socket.connected) {
      socket.connect()
    }

    actualizeSocketData()
    setSocketConnected(socket.connected)
    setSocketReconnecting(false)
  }

  return {
    actualizeSocketData,
    socketConnect
  }
}
