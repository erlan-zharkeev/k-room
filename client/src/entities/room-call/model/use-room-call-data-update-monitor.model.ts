import { registerSocketEventListeners } from 'src/shared/api'

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
  let disposeRoomCallDataUpdateMonitorListeners: (() => void) | null = null

  const initializeRoomCallDataUpdateMonitor = () => {
    disposeRoomCallDataUpdateMonitorListeners = registerSocketEventListeners([
      ['room-calls-updated', syncRoomCalls],
      ['room-call-started', syncStartedRoomCall],
      ['room-call-joined', syncJoinedRoomCall],
      ['room-call-declined', syncDeclinedRoomCall],
      ['room-call-left', syncLeftRoomCall],
      ['room-call-ended', syncEndedRoomCall],
      ['room-call-media-state-updated', syncRoomCallMediaStateUpdated]
    ])
  }

  const disposeRoomCallDataUpdateMonitor = () => {
    disposeRoomCallDataUpdateMonitorListeners?.()
    disposeRoomCallDataUpdateMonitorListeners = null
  }

  return {
    initializeRoomCallDataUpdateMonitor,
    disposeRoomCallDataUpdateMonitor
  }
}
