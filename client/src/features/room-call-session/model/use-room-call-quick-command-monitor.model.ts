import { registerSocketEventListeners } from 'src/shared/api'

import type { HandleRoomCallHandRaisedUpdated, HandleRoomCallQuickCommandReceived } from '../config/types'

export const useRoomCallQuickCommandMonitor = (
  handleRoomCallQuickCommandReceived: HandleRoomCallQuickCommandReceived,
  handleRoomCallHandRaisedUpdated: HandleRoomCallHandRaisedUpdated
) => {
  let disposeRoomCallQuickCommandMonitorListeners: (() => void) | null = null

  const initializeRoomCallQuickCommandMonitor = () => {
    disposeRoomCallQuickCommandMonitorListeners = registerSocketEventListeners([
      ['room-call-quick-command-received', handleRoomCallQuickCommandReceived],
      ['room-call-hand-raised-updated', handleRoomCallHandRaisedUpdated]
    ])
  }

  const disposeRoomCallQuickCommandMonitor = () => {
    disposeRoomCallQuickCommandMonitorListeners?.()
    disposeRoomCallQuickCommandMonitorListeners = null
  }

  return {
    disposeRoomCallQuickCommandMonitor,
    initializeRoomCallQuickCommandMonitor
  }
}
