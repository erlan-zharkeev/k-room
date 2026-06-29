import { computed, toRef } from 'vue'

import { CHAT_ROOM_I18N, isRoomSupport, useChatRoom } from 'src/entities/chat-room'
import { useI18n } from 'src/shared/lib'

import { CHAT_ROOM_CONTENT_I18N } from '../config/i18n'
import type { MessageBodyProps, MessageBodySelectMessage } from '../config/types'
import { resolveMessagePreviewText } from '../lib/resolve-message-preview-text'

export const useMessageReferencePreview = (props: MessageBodyProps, onSelectMessage: MessageBodySelectMessage) => {
  const message = toRef(props, 'message')
  const { t } = useI18n()
  const { getById } = useChatRoom()

  const messageReference = computed(() => message.value.repliedMessage)
  const messageReferenceRoomId = computed(() => messageReference.value?.roomId ?? props.room.id)
  const messageReferenceRoom = computed(() => getById(messageReferenceRoomId.value))
  const messageReferenceAuthorNickname = computed(() => {
    const reference = messageReference.value
    const room = messageReferenceRoom.value

    if (!reference) return ''

    if (
      reference.authorKind === 'support' ||
      (room && isRoomSupport(room) && reference.authorId !== room.supportOwnerId)
    ) {
      return t(CHAT_ROOM_I18N.supportTitle)
    }

    return reference.authorNickname
  })
  const canSelectMessageReference = computed(() => {
    const reference = messageReference.value
    const room = messageReferenceRoom.value

    if (!reference || !room) return false

    return room.messages.includes(reference.id)
  })
  const messageReferencePreviewTitle = computed(() => {
    const reference = messageReference.value

    if (!reference) return ''

    const titleSource = reference.forward ? CHAT_ROOM_CONTENT_I18N.forwardMessage : CHAT_ROOM_CONTENT_I18N.replyMessage
    const actionTitle = t(titleSource)

    return `${actionTitle}: ${messageReferenceAuthorNickname.value}`
  })
  const messageReferencePreviewText = computed(() =>
    messageReference.value ? resolveMessagePreviewText(messageReference.value) : ''
  )

  const selectMessageReference = () => {
    const reference = messageReference.value
    const roomId = messageReferenceRoomId.value

    if (!reference || !canSelectMessageReference.value) return

    onSelectMessage({
      roomId,
      messageId: reference.id
    })
  }

  return {
    messageReference,
    canSelectMessageReference,
    messageReferencePreviewText,
    messageReferencePreviewTitle,
    selectMessageReference
  }
}
