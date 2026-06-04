import type { EventRoomCallStarted } from 'global-shared'

import { useChatRoom } from 'src/entities/chat-room'
import { useSettings } from 'src/entities/setting'
import { useSystem } from 'src/entities/system'
import { useUser } from 'src/entities/user'
import { playAppNotificationSound } from 'src/shared/lib'

export const useRoomCallNotification = () => {
  const { getById } = useChatRoom()
  const { settings } = useSettings()
  const { hasInteracted } = useSystem()
  const { user } = useUser()

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

    if (!hasInteracted.value) return
    if (!general.sound) return
    if (!calls.sound) return
    if (!resolveStartedRoomCallNotificationRoom(payload)) return

    try {
      await playAppNotificationSound(settings.value.ioDevices.audioOutputDeviceId)
    } catch (error) {
      void error
    }
  }

  const notifyStartedRoomCall = (payload: EventRoomCallStarted) => {
    void playStartedRoomCallSound(payload)
  }

  return {
    notifyStartedRoomCall
  }
}
