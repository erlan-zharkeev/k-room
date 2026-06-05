import { type EventMessageDelivered, isMessageStatusDelivered } from 'global-shared'

import { useChatRoom } from 'src/entities/chat-room'
import { useAppSound, useSettings } from 'src/entities/setting'
import { useSystem } from 'src/entities/system'
import { APP_SOUND_KIND, useAppToast } from 'src/shared/lib'

export const useMessageNotification = () => {
  const { getById } = useChatRoom()
  const { settings } = useSettings()
  const { hasInteracted } = useSystem()
  const { playAppSound } = useAppSound()
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

  const playDeliveredMessageSound = async (payload: EventMessageDelivered) => {
    const { general, messages } = settings.value.notifications

    if (!hasInteracted.value) return
    if (!canNotifyDeliveredMessage(payload)) return
    if (!general.sound) return
    if (!messages.sound) return

    try {
      await playAppSound(APP_SOUND_KIND.MESSAGE)
    } catch (error) {
      void error
    }
  }

  return {
    playDeliveredMessageSound,
    showDeliveredMessageToast
  }
}
