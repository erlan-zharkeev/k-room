import { socket } from 'src/shared/api'

import type { HandleRoomCallSignalReceived } from '../config/types'

export const useRoomCallSignalMonitor = (handleRoomCallSignalReceived: HandleRoomCallSignalReceived) => {
  const initializeRoomCallSignalMonitor = () => {
    socket.on('room-call-signal-received', handleRoomCallSignalReceived)
  }

  const disposeRoomCallSignalMonitor = () => {
    socket.off('room-call-signal-received', handleRoomCallSignalReceived)
  }

  return {
    initializeRoomCallSignalMonitor,
    disposeRoomCallSignalMonitor
  }
}
