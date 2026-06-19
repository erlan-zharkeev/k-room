import { registerSocketEventListeners } from 'src/shared/api'

import { useRoomCallNotification } from './use-room-call-notification.model'

export const useRoomCallNotificationMonitor = () => {
  const { notifyStartedRoomCall, stopRoomCallSound, stopStartedRoomCallSound } = useRoomCallNotification()
  let disposeRoomCallNotificationMonitorListeners: (() => void) | null = null

  const initializeRoomCallNotificationMonitor = () => {
    disposeRoomCallNotificationMonitorListeners = registerSocketEventListeners([
      ['room-call-started', notifyStartedRoomCall],
      ['room-call-joined', stopRoomCallSound],
      ['room-call-declined', stopRoomCallSound],
      ['room-call-left', stopRoomCallSound],
      ['room-call-ended', stopRoomCallSound]
    ])
  }

  const disposeRoomCallNotificationMonitor = () => {
    disposeRoomCallNotificationMonitorListeners?.()
    disposeRoomCallNotificationMonitorListeners = null
    stopStartedRoomCallSound()
  }

  return {
    initializeRoomCallNotificationMonitor,
    disposeRoomCallNotificationMonitor
  }
}
