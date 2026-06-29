import { type EventMessageDelivered, isMessageStatusDelivered } from 'global-shared'

import { CHAT_ROOM_I18N, isRoomSupport, useChatRoom } from 'src/entities/chat-room'
import { useContact } from 'src/entities/contact'
import { useKnownUser } from 'src/entities/known-user'
import { useMedia } from 'src/entities/media-file'
import { useAppSound, useSettings } from 'src/entities/setting'
import { useSystem } from 'src/entities/system'
import { useAppToast, useI18n } from 'src/shared/lib'

import { isClientPushEnabled, showClientPushWithImage } from '../lib/client-push'

export const useMessageNotification = () => {
  const { getById } = useChatRoom()
  const { contactById } = useContact()
  const { knownUserById } = useKnownUser()
  const { get: getMedia } = useMedia()
  const { settings } = useSettings()
  const { hasInteracted } = useSystem()
  const { playAppSound } = useAppSound()
  const { t } = useI18n()
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

  const resolveMessageAuthorAvatarId = ({ roomId, message }: EventMessageDelivered) => {
    const room = getById(roomId)

    if (message.authorKind === 'support' || (room && isRoomSupport(room) && message.authorId !== room.supportOwnerId)) {
      return null
    }

    return (
      contactById.value.get(message.authorId)?.avatarId ?? knownUserById.value.get(message.authorId)?.avatarId ?? null
    )
  }

  const resolveMessageTitle = ({ roomId, message }: EventMessageDelivered) => {
    const room = getById(roomId)

    if (message.authorKind === 'support' || (room && isRoomSupport(room) && message.authorId !== room.supportOwnerId)) {
      return t(CHAT_ROOM_I18N.supportTitle)
    }

    return message.authorNickname
  }

  const showDeliveredMessageToast = (payload: EventMessageDelivered) => {
    const { general, messages } = settings.value.notifications

    if (!canNotifyDeliveredMessage(payload)) return
    if (!general.toast) return
    if (!messages.toast) return

    toast.add(
      {
        title: resolveMessageTitle(payload),
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

  const showDeliveredMessagePush = async ({ message, roomId }: EventMessageDelivered) => {
    const { general, messages } = settings.value.notifications

    if (!canNotifyDeliveredMessage({ message, roomId })) return
    if (!isClientPushEnabled(general, messages)) return

    await showClientPushWithImage(
      resolveMessageTitle({ message, roomId }),
      {
        body: message.body,
        tag: message.id
      },
      resolveMessageAuthorAvatarId({ message, roomId }),
      getMedia
    )
  }

  return {
    playDeliveredMessageSound,
    showDeliveredMessagePush,
    showDeliveredMessageToast
  }
}
