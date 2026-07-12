import { socket } from './socket'
import { startSocketDataLoading } from './socket-data-status'
import { setSocketConnected, setSocketReconnectFailed, setSocketReconnecting } from './socket-status'
import { syncSocketNativeAuthSession } from './sync-socket-native-auth-session'

export const useSocketConnect = () => {
  const actualizeSocketData = () => {
    if (!socket.connected) return

    startSocketDataLoading()
    socket.emit('initialize')
    socket.emit('actualize-user-data')
  }

  const socketConnect = () => {
    syncSocketNativeAuthSession()

    if (!socket.connected) {
      setSocketReconnectFailed(false)
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
