import type { EventRoomCallStarted } from 'global-shared'

import { useChatRoom } from 'src/entities/chat-room'
import { useContact } from 'src/entities/contact'
import { useKnownUser } from 'src/entities/known-user'
import { useSettings } from 'src/entities/setting'
import { useSystem } from 'src/entities/system'
import { useUser } from 'src/entities/user'
import { playAppNotificationSound, useAppToast, useI18n } from 'src/shared/lib'

import { APP_PAGE_I18N } from '../config/i18n'
import { resolveRoomCallNotificationContent } from '../lib/resolve-room-call-notification-content'

export const useRoomCallNotification = () => {
  const { t } = useI18n()
  const { getById } = useChatRoom()
  const { contactById } = useContact()
  const { knownUserById } = useKnownUser()
  const { settings } = useSettings()
  const { hasInteracted } = useSystem()
  const { user } = useUser()
  const toast = useAppToast()

  const resolveStartedRoomCallNotificationRoom = ({ roomCall }: EventRoomCallStarted) => {
    const isOwnRoomCall = roomCall.initiatorId === user.value.id

    if (isOwnRoomCall) return
    if (!settings.value.notifications.enabled) return

    const room = getById(roomCall.roomId)

    if (!room) return
    if (room.isMuted) return

    return room
  }

  const showStartedRoomCallToast = (payload: EventRoomCallStarted) => {
    const { calls, general } = settings.value.notifications

    if (!general.toast) return
    if (!calls.toast) return

    const room = resolveStartedRoomCallNotificationRoom(payload)

    if (!room) return

    toast.add(
      {
        title: t(APP_PAGE_I18N.incomingRoomCall),
        content: resolveRoomCallNotificationContent(
          room,
          user.value.id,
          contactById.value,
          knownUserById.value,
          t(APP_PAGE_I18N.privateRoomCall),
          t(APP_PAGE_I18N.groupRoomCall)
        )
      },
      'call'
    )
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
    showStartedRoomCallToast(payload)
    void playStartedRoomCallSound(payload)
  }

  return {
    notifyStartedRoomCall
  }
}
