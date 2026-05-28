import { type EventMessageDelivered, isFunction, isMessageStatusDelivered } from 'global-shared'

import { useChatRoom } from 'src/entities/chat-room'
import { useSettings } from 'src/entities/setting'
import { useSystem } from 'src/entities/system'
import { MESSAGE_NOTIFICATION_SOUND_SRC, useAppToast } from 'src/shared/lib'

export const useMessageNotification = () => {
  const { getById } = useChatRoom()
  const { settings } = useSettings()
  const { hasInteracted } = useSystem()
  const toast = useAppToast()

  const canNotifyDeliveredMessage = ({ roomId, message }: EventMessageDelivered) => {
    if (message.isSelf) return
    if (!isMessageStatusDelivered(message.status)) return

    const { enabled } = settings.value.notifications

    if (!enabled) return

    const room = getById(roomId)

    if (room?.isMuted) return

    return true
  }

  const showDeliveredMessageToast = (payload: EventMessageDelivered) => {
    const { general, messages } = settings.value.notifications

    if (!canNotifyDeliveredMessage(payload)) return
    if (!general.toast) return
    if (!messages.toast) return

    toast.add(
      {
        title: payload.message.authorNickname,
        content: payload.message.body
      },
      'message'
    )
  }

  const playNotificationSound = async () => {
    const audio = new Audio(MESSAGE_NOTIFICATION_SOUND_SRC)
    const { audioOutputDeviceId } = settings.value.ioDevices

    if (isFunction(audio.setSinkId) && audioOutputDeviceId) {
      await audio.setSinkId(audioOutputDeviceId)
    }

    await audio.play()
  }

  const playDeliveredMessageSound = async (payload: EventMessageDelivered) => {
    const { general, messages } = settings.value.notifications

    if (!hasInteracted.value) return
    if (!canNotifyDeliveredMessage(payload)) return
    if (!general.sound) return
    if (!messages.sound) return

    try {
      await playNotificationSound()
    } catch (error) {
      void error
    }
  }

  return {
    playDeliveredMessageSound,
    showDeliveredMessageToast
  }
}
