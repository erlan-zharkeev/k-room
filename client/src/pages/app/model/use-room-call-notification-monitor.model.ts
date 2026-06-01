import { socket } from 'src/shared/api'

import { useRoomCallNotification } from './use-room-call-notification.model'

export const useRoomCallNotificationMonitor = () => {
  const { notifyStartedRoomCall } = useRoomCallNotification()

  const initializeRoomCallNotificationMonitor = () => {
    socket.on('room-call-started', notifyStartedRoomCall)
  }

  const disposeRoomCallNotificationMonitor = () => {
    socket.off('room-call-started', notifyStartedRoomCall)
  }

  return {
    initializeRoomCallNotificationMonitor,
    disposeRoomCallNotificationMonitor
  }
}
