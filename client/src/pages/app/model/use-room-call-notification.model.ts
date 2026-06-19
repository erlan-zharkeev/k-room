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
  let startedRoomCallSoundRoomCallId = ''

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
    startedRoomCallSoundRoomCallId = roomCall.id

    try {
      await startLoopAppSound('call-ring')
      const isCurrentStartedRoomCallSound = startedRoomCallSoundRoomCallId === roomCall.id

      if (!isCurrentStartedRoomCallSound) {
        if (!startedRoomCallSoundRoomCallId) {
          stopAppSound('call-ring')
        }

        return
      }
    } catch (error) {
      if (startedRoomCallSoundRoomCallId === roomCall.id) {
        stopStartedRoomCallSound()
      }

      void error
    }
  }

  const stopStartedRoomCallSound = () => {
    stopAppSound('call-ring')
    startedRoomCallSoundRoomCallId = ''
  }

  const notifyStartedRoomCall = (payload: EventRoomCallStarted) => {
    void playStartedRoomCallSound(payload)
  }

  const stopRoomCallSound = ({
    roomCallId
  }: EventRoomCallJoined | EventRoomCallDeclined | EventRoomCallLeft | EventRoomCallEnded) => {
    if (roomCallId !== startedRoomCallSoundRoomCallId) return

    stopStartedRoomCallSound()
  }

  return {
    notifyStartedRoomCall,
    stopRoomCallSound,
    stopStartedRoomCallSound
  }
}
