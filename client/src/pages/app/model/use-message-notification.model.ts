import { type EventMessageDelivered, isMessageStatusDelivered } from 'global-shared'

import { useChatRoom } from 'src/entities/chat-room'
import { useContact } from 'src/entities/contact'
import { useKnownUser } from 'src/entities/known-user'
import { useMedia } from 'src/entities/media-file'
import { useAppSound, useSettings } from 'src/entities/setting'
import { useSystem } from 'src/entities/system'
import { useAppToast } from 'src/shared/lib'

import { showBrowserPushWithImage } from '../lib/browser-push-image'

export const useMessageNotification = () => {
  const { getById } = useChatRoom()
  const { contactById } = useContact()
  const { knownUserById } = useKnownUser()
  const { get: getMedia } = useMedia()
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

  const resolveMessageAuthorAvatarId = (authorId: string) => {
    return contactById.value.get(authorId)?.avatarId ?? knownUserById.value.get(authorId)?.avatarId ?? null
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
      await playAppSound('incoming-message')
    } catch (error) {
      void error
    }
  }

  const showDeliveredMessageBrowserPush = async ({ message, roomId }: EventMessageDelivered) => {
    const { general, messages } = settings.value.notifications

    if (!canNotifyDeliveredMessage({ message, roomId })) return
    if (!general.browserPush) return
    if (!messages.browserPush) return

    await showBrowserPushWithImage(
      message.authorNickname,
      {
        body: message.body,
        tag: message.id
      },
      resolveMessageAuthorAvatarId(message.authorId),
      getMedia
    )
  }

  return {
    playDeliveredMessageSound,
    showDeliveredMessageBrowserPush,
    showDeliveredMessageToast
  }
}
