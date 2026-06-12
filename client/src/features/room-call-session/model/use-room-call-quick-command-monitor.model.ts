import { socket } from 'src/shared/api'

import type { HandleRoomCallHandRaisedUpdated, HandleRoomCallQuickCommandReceived } from '../config/types'

export const useRoomCallQuickCommandMonitor = (
  handleRoomCallQuickCommandReceived: HandleRoomCallQuickCommandReceived,
  handleRoomCallHandRaisedUpdated: HandleRoomCallHandRaisedUpdated
) => {
  const initializeRoomCallQuickCommandMonitor = () => {
    socket.on('room-call-quick-command-received', handleRoomCallQuickCommandReceived)
    socket.on('room-call-hand-raised-updated', handleRoomCallHandRaisedUpdated)
  }

  const disposeRoomCallQuickCommandMonitor = () => {
    socket.off('room-call-quick-command-received', handleRoomCallQuickCommandReceived)
    socket.off('room-call-hand-raised-updated', handleRoomCallHandRaisedUpdated)
  }

  return {
    disposeRoomCallQuickCommandMonitor,
    initializeRoomCallQuickCommandMonitor
  }
}
