import { socket } from 'src/shared/api'

import { useRoomCallSync } from './use-room-call-sync.model'

export const useRoomCallDataUpdateMonitor = () => {
  const { syncRoomCalls, syncStartedRoomCall } = useRoomCallSync()

  const initializeRoomCallDataUpdateMonitor = () => {
    socket.on('room-calls-updated', syncRoomCalls)
    socket.on('room-call-started', syncStartedRoomCall)
  }

  const disposeRoomCallDataUpdateMonitor = () => {
    socket.off('room-calls-updated', syncRoomCalls)
    socket.off('room-call-started', syncStartedRoomCall)
  }

  return {
    initializeRoomCallDataUpdateMonitor,
    disposeRoomCallDataUpdateMonitor
  }
}
