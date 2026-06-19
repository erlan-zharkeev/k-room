import { registerSocketEventListeners } from 'src/shared/api'

import type { HandleRoomCallSignalReceived } from '../config/types'

export const useRoomCallSignalMonitor = (handleRoomCallSignalReceived: HandleRoomCallSignalReceived) => {
  let disposeRoomCallSignalMonitorListeners: (() => void) | null = null

  const initializeRoomCallSignalMonitor = () => {
    disposeRoomCallSignalMonitorListeners = registerSocketEventListeners([
      ['room-call-signal-received', handleRoomCallSignalReceived]
    ])
  }

  const disposeRoomCallSignalMonitor = () => {
    disposeRoomCallSignalMonitorListeners?.()
    disposeRoomCallSignalMonitorListeners = null
  }

  return {
    initializeRoomCallSignalMonitor,
    disposeRoomCallSignalMonitor
  }
}
