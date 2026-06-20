import type {
  EventRoomCallDeclined,
  EventRoomCallEnded,
  EventRoomCallJoined,
  EventRoomCallLeft,
  EventRoomCallStarted
} from 'global-shared'

import { useChatRoom } from 'src/entities/chat-room'
import { useAppSound, useSettings } from 'src/entities/setting'
import { useSystem } from 'src/entities/system'
import { useUser } from 'src/entities/user'

export const useRoomCallNotification = () => {
  const { getById } = useChatRoom()
  const { settings } = useSettings()
  const { hasInteracted } = useSystem()
  const { startLoopAppSound, stopAppSound } = useAppSound()
  const { user } = useUser()
  let incomingRoomCallSoundRoomCallId = ''

  const resolveStartedRoomCallNotificationRoom = ({ roomCall }: EventRoomCallStarted) => {
    const isOwnRoomCall = roomCall.initiatorId === user.value.id

    if (isOwnRoomCall) return
    if (!settings.value.notifications.enabled) return

    const room = getById(roomCall.roomId)

    if (!room) return
    if (room.isMuted) return

    return room
  }

  const playStartedRoomCallSound = async (payload: EventRoomCallStarted) => {
    const { calls, general } = settings.value.notifications
    const { roomCall } = payload

    if (!hasInteracted.value) return
    if (!general.sound) return
    if (!calls.sound) return
    if (!resolveStartedRoomCallNotificationRoom(payload)) return

    stopStartedRoomCallSound()
    incomingRoomCallSoundRoomCallId = roomCall.id

    try {
      await startLoopAppSound('incoming-call')
      const isCurrentStartedRoomCallSound = incomingRoomCallSoundRoomCallId === roomCall.id

      if (!isCurrentStartedRoomCallSound) {
        if (!incomingRoomCallSoundRoomCallId) {
          stopAppSound('incoming-call')
        }

        return
      }
    } catch (error) {
      if (incomingRoomCallSoundRoomCallId === roomCall.id) {
        stopStartedRoomCallSound()
      }

      void error
    }
  }

  const stopStartedRoomCallSound = () => {
    stopAppSound('incoming-call')
    incomingRoomCallSoundRoomCallId = ''
  }

  const notifyStartedRoomCall = (payload: EventRoomCallStarted) => {
    void playStartedRoomCallSound(payload)
  }

  const stopRoomCallSound = ({
    roomCallId
  }: EventRoomCallJoined | EventRoomCallDeclined | EventRoomCallLeft | EventRoomCallEnded) => {
    if (roomCallId !== incomingRoomCallSoundRoomCallId) return

    stopStartedRoomCallSound()
  }

  return {
    notifyStartedRoomCall,
    stopRoomCallSound,
    stopStartedRoomCallSound
  }
}
