import type {
  ChatRoom,
  EventRoomCallDeclined,
  EventRoomCallEnded,
  EventRoomCallJoined,
  EventRoomCallLeft,
  EventRoomCallStarted
} from 'global-shared'

import { isRoomPrivate, useChatRoom } from 'src/entities/chat-room'
import { useContact } from 'src/entities/contact'
import { useKnownUser } from 'src/entities/known-user'
import { useAppSound, useSettings } from 'src/entities/setting'
import { useSystem } from 'src/entities/system'
import { useUser } from 'src/entities/user'
import { ROOM_CALL_SESSION_I18N } from 'src/features/room-call-session'
import { showBrowserPush, useI18n } from 'src/shared/lib'

export const useRoomCallNotification = () => {
  const { getById } = useChatRoom()
  const { contactById } = useContact()
  const { knownUserById } = useKnownUser()
  const { settings } = useSettings()
  const { hasInteracted } = useSystem()
  const { startLoopAppSound, stopAppSound } = useAppSound()
  const { t } = useI18n()
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

  const resolveRoomCallInitiatorNickname = (initiatorId: string) => {
    return contactById.value.get(initiatorId)?.nickname ?? knownUserById.value.get(initiatorId)?.nickname
  }

  const resolveStartedRoomCallBrowserPushTitle = ({ roomCall }: EventRoomCallStarted, room: ChatRoom) => {
    const isPrivateRoom = isRoomPrivate(room)
    const title = isPrivateRoom
      ? resolveRoomCallInitiatorNickname(roomCall.initiatorId)
      : room.chatName || t(ROOM_CALL_SESSION_I18N.unknownRoom)
    const fallbackTitle = t(ROOM_CALL_SESSION_I18N.unknownRoom)
    const textSource = isPrivateRoom
      ? ROOM_CALL_SESSION_I18N.incomingPrivateRoomCallBrowserPush
      : ROOM_CALL_SESSION_I18N.incomingGroupRoomCallBrowserPush

    return t(textSource, { title: title || fallbackTitle })
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

  const showStartedRoomCallBrowserPush = (payload: EventRoomCallStarted) => {
    const { calls, general } = settings.value.notifications
    const { roomCall } = payload
    const room = resolveStartedRoomCallNotificationRoom(payload)

    if (!general.browserPush) return
    if (!calls.browserPush) return
    if (!room) return

    showBrowserPush(resolveStartedRoomCallBrowserPushTitle(payload, room), {
      tag: roomCall.id
    })
  }

  const stopStartedRoomCallSound = () => {
    stopAppSound('incoming-call')
    incomingRoomCallSoundRoomCallId = ''
  }

  const notifyStartedRoomCall = (payload: EventRoomCallStarted) => {
    showStartedRoomCallBrowserPush(payload)
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
