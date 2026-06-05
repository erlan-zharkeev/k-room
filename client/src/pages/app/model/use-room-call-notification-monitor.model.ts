import { socket } from 'src/shared/api'

import { useRoomCallNotification } from './use-room-call-notification.model'

export const useRoomCallNotificationMonitor = () => {
  const { notifyStartedRoomCall, stopRoomCallSound, stopStartedRoomCallSound } = useRoomCallNotification()

  const initializeRoomCallNotificationMonitor = () => {
    socket.on('room-call-started', notifyStartedRoomCall)
    socket.on('room-call-joined', stopRoomCallSound)
    socket.on('room-call-declined', stopRoomCallSound)
    socket.on('room-call-left', stopRoomCallSound)
    socket.on('room-call-ended', stopRoomCallSound)
  }

  const disposeRoomCallNotificationMonitor = () => {
    socket.off('room-call-started', notifyStartedRoomCall)
    socket.off('room-call-joined', stopRoomCallSound)
    socket.off('room-call-declined', stopRoomCallSound)
    socket.off('room-call-left', stopRoomCallSound)
    socket.off('room-call-ended', stopRoomCallSound)
    stopStartedRoomCallSound()
  }

  return {
    initializeRoomCallNotificationMonitor,
    disposeRoomCallNotificationMonitor
  }
}
