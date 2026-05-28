import {
  MESSAGE_BODY_MAX_LENGTH,
  MESSAGE_STATUS_VALUE,
  type EventSendMessage,
  type Message,
  type SocketActions
} from 'global-shared'
import { v4 as uuidv4 } from 'uuid'
import { computed, type Ref, ref } from 'vue'

import { useChatRoom } from 'src/entities/chat-room'
import { useMessage } from 'src/entities/message'
import { useUser } from 'src/entities/user'
import { useChatRoomTypingEmitter } from 'src/features/chat-room-typing'
import { socket } from 'src/shared/api'
import type { ChatRoomRecord } from 'src/shared/lib'

import type { ChatRoomFooterSelectEditingMessage } from '../config/types'

import { useMessageEdit } from './use-message-edit.model'
import { useMessageImageDraft } from './use-message-image-draft.model'

export const useChatRoomFooter = (
  room: Ref<ChatRoomRecord>,
  onSelectEditingMessage: ChatRoomFooterSelectEditingMessage
) => {
  const { mutate } = useChatRoom()
  const { put } = useMessage()
  const { user } = useUser()
  const messageText = ref('')
  const { stopTyping } = useChatRoomTypingEmitter(room, messageText)
  const {
    editingMessageId,
    editingMessageImages,
    editingMessagePreviewText,
    messageEditText,
    canSubmitMessageEdit,
    cancelMessageEdit,
    isEditingRoomMessage,
    isUpdatingEditedMessage,
    removeEditingMessageImage,
    submitMessageEdit
  } = useMessageEdit()
  const {
    messageImageDraftImages,
    messageImageDraftUploadValue,
    openMessageImageUpload,
    removeMessageImageDraft,
    showUnsupportedMessageImageFormatError,
    updateMessageImageDraft
  } = useMessageImageDraft()
  const isEditingCurrentRoomMessage = computed(() => isEditingRoomMessage(room.value.id))
  const isSendDisabled = computed(() => {
    const hasMessageBody = Boolean(messageText.value.trim())
    const hasValidLength = messageText.value.length <= MESSAGE_BODY_MAX_LENGTH
    const hasUserId = Boolean(user.value.id)
    const canSendMessage = hasMessageBody && hasValidLength

    return !canSendMessage || !hasUserId
  })

  const selectEditingMessage = () => {
    const messageId = editingMessageId.value
    const isEditingCurrentRoom = isEditingCurrentRoomMessage.value

    if (!messageId || !isEditingCurrentRoom) return

    onSelectEditingMessage(messageId)
  }

  const sendMessage = async (roomId: string) => {
    const body = messageText.value.trim()
    const { id: authorId, nickname: authorNickname } = user.value

    if (!body || !authorId) return

    const message: Message = {
      id: uuidv4(),
      authorId,
      authorNickname,
      body,
      createdAt: Date.now(),
      isSelf: true,
      status: MESSAGE_STATUS_VALUE.SENDING,
      reactions: [],
      images: []
    }

    const payload: EventSendMessage = {
      roomId,
      message
    }

    await put(message)
    await mutate(roomId, (room) => {
      room.messages.push(message.id)
    })

    socket.emit<SocketActions>('send-message', payload)
    stopTyping()
    messageText.value = ''
  }

  return {
    messageText,
    messageImageDraftImages,
    messageImageDraftUploadValue,
    editingMessagePreviewText,
    editingMessageImages,
    messageEditText,
    isSendDisabled,
    canSubmitMessageEdit,
    isEditingCurrentRoomMessage,
    isUpdatingEditedMessage,
    cancelMessageEdit,
    openMessageImageUpload,
    removeEditingMessageImage,
    removeMessageImageDraft,
    selectEditingMessage,
    sendMessage,
    showUnsupportedMessageImageFormatError,
    submitMessageEdit,
    updateMessageImageDraft
  }
}
