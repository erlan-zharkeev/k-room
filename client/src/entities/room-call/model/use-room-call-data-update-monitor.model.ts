import { socket } from 'src/shared/api'

import { useRoomCallSync } from './use-room-call-sync.model'

export const useRoomCallDataUpdateMonitor = () => {
  const {
    syncEndedRoomCall,
    syncDeclinedRoomCall,
    syncJoinedRoomCall,
    syncLeftRoomCall,
    syncRoomCallMediaStateUpdated,
    syncRoomCalls,
    syncStartedRoomCall
  } = useRoomCallSync()

  const initializeRoomCallDataUpdateMonitor = () => {
    socket.on('room-calls-updated', syncRoomCalls)
    socket.on('room-call-started', syncStartedRoomCall)
    socket.on('room-call-joined', syncJoinedRoomCall)
    socket.on('room-call-declined', syncDeclinedRoomCall)
    socket.on('room-call-left', syncLeftRoomCall)
    socket.on('room-call-ended', syncEndedRoomCall)
    socket.on('room-call-media-state-updated', syncRoomCallMediaStateUpdated)
  }

  const disposeRoomCallDataUpdateMonitor = () => {
    socket.off('room-calls-updated', syncRoomCalls)
    socket.off('room-call-started', syncStartedRoomCall)
    socket.off('room-call-joined', syncJoinedRoomCall)
    socket.off('room-call-declined', syncDeclinedRoomCall)
    socket.off('room-call-left', syncLeftRoomCall)
    socket.off('room-call-ended', syncEndedRoomCall)
    socket.off('room-call-media-state-updated', syncRoomCallMediaStateUpdated)
  }

  return {
    initializeRoomCallDataUpdateMonitor,
    disposeRoomCallDataUpdateMonitor
  }
}
