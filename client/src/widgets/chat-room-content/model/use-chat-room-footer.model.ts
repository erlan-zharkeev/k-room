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
import { cloneMediaObjects } from '../lib/clone-media-objects'

import { useChatRoomMessageEmojiPicker } from './use-chat-room-message-emoji-picker.model'
import { useMessageAttachmentDraft } from './use-message-attachment-draft.model'
import { useMessageDraftReference } from './use-message-draft-reference.model'
import { useMessageEdit } from './use-message-edit.model'

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
    messageEmojiDropdownAnchor,
    emojiPickerLocale,
    emojiPickerQuickList,
    isMessageEmojiDropdownOpen,
    closeMessageEmojiDropdown,
    selectMessageEmoji,
    toggleMessageEmojiDropdown
  } = useChatRoomMessageEmojiPicker(messageText)
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
    buildMessageAudioDraftPayload,
    buildMessageDocumentDraftPayload,
    buildMessageImageDraftPayload,
    clearSentMessageAttachmentDraft,
    editingMessageAttachmentItems,
    hasMessageAttachmentDraft,
    messageAttachmentDraftItems,
    messageAttachmentDraftUploadValue,
    messageAudioDraftAudios,
    messageDocumentDraftDocuments,
    messageImageDraftImages,
    openMessageAttachmentUpload,
    removeEditingMessageAttachment,
    removeMessageAttachmentDraft,
    showUnsupportedMessageAttachmentFormatError,
    updateMessageAttachmentDraft
  } = useMessageAttachmentDraft({
    editingMessageImages,
    removeEditingMessageImage
  })
  const {
    messageDraftReference,
    messageDraftReferenceId,
    messageDraftReferencePreviewText,
    messageDraftReferenceTitle,
    buildMessageDraftReferencePayload,
    cancelMessageDraftReference,
    isMessageDraftReferenceCurrentRoom
  } = useMessageDraftReference(room)
  const isEditingCurrentRoomMessage = computed(() => isEditingRoomMessage(room.value.id))
  const isSendDisabled = computed(() => {
    const hasMessageBody = Boolean(messageText.value.trim())
    const hasMessageDraft = hasMessageAttachmentDraft.value
    const hasMessageReference = isMessageDraftReferenceCurrentRoom.value
    const hasMessageContent = hasMessageBody || hasMessageDraft || hasMessageReference
    const hasValidLength = messageText.value.length <= MESSAGE_BODY_MAX_LENGTH
    const hasUserId = Boolean(user.value.id)
    const canSendMessage = hasMessageContent && hasValidLength

    return !canSendMessage || !hasUserId
  })

  const selectEditingMessage = () => {
    const messageId = editingMessageId.value
    const isEditingCurrentRoom = isEditingCurrentRoomMessage.value

    if (!messageId || !isEditingCurrentRoom) return

    onSelectEditingMessage(messageId)
  }

  const selectMessageDraftReference = () => {
    if (!messageDraftReferenceId.value || !isMessageDraftReferenceCurrentRoom.value) return

    onSelectEditingMessage(messageDraftReferenceId.value)
  }

  const sendMessage = async (roomId: string) => {
    const body = messageText.value.trim()
    const images = cloneMediaObjects(messageImageDraftImages.value)
    const documents = cloneMediaObjects(messageDocumentDraftDocuments.value)
    const audios = cloneMediaObjects(messageAudioDraftAudios.value)
    const hasImageOrDocumentDraft = Boolean(images.length || documents.length)
    const hasMessageDraft = Boolean(hasImageOrDocumentDraft || audios.length)
    const { id: authorId, nickname: authorNickname } = user.value
    const repliedMessage = buildMessageDraftReferencePayload(roomId)
    const hasMessageBody = Boolean(body)
    const hasMessageReference = Boolean(repliedMessage)
    const hasMessageContent = hasMessageBody || hasMessageDraft || hasMessageReference

    if (!hasMessageContent || !authorId) return

    const [payloadImages, payloadDocuments, payloadAudios] = await Promise.all([
      buildMessageImageDraftPayload(),
      buildMessageDocumentDraftPayload(),
      buildMessageAudioDraftPayload()
    ])

    const message: Message = {
      id: uuidv4(),
      authorId,
      authorNickname,
      body,
      createdAt: Date.now(),
      isSelf: true,
      status: MESSAGE_STATUS_VALUE.SENDING,
      reactions: [],
      images,
      documents,
      audios,
      ...(repliedMessage && { repliedMessage })
    }

    const payload: EventSendMessage = {
      roomId,
      message: {
        ...message,
        images: payloadImages,
        documents: payloadDocuments,
        audios: payloadAudios
      }
    }

    await put(message)
    await mutate(roomId, (room) => {
      room.messages.push(message.id)
    })

    socket.emit<SocketActions>('send-message', payload)
    stopTyping()
    messageText.value = ''
    if (repliedMessage) {
      cancelMessageDraftReference()
    }
    clearSentMessageAttachmentDraft()
    closeMessageEmojiDropdown()
  }

  return {
    messageText,
    messageEmojiDropdownAnchor,
    editingMessageAttachmentItems,
    messageAttachmentDraftItems,
    messageAttachmentDraftUploadValue,
    emojiPickerLocale,
    emojiPickerQuickList,
    editingMessagePreviewText,
    messageDraftReference,
    messageDraftReferencePreviewText,
    messageDraftReferenceTitle,
    messageEditText,
    isMessageEmojiDropdownOpen,
    isSendDisabled,
    canSubmitMessageEdit,
    isEditingCurrentRoomMessage,
    isMessageDraftReferenceCurrentRoom,
    isUpdatingEditedMessage,
    cancelMessageEdit,
    cancelMessageDraftReference,
    closeMessageEmojiDropdown,
    openMessageAttachmentUpload,
    removeEditingMessageAttachment,
    removeMessageAttachmentDraft,
    selectMessageEmoji,
    selectEditingMessage,
    selectMessageDraftReference,
    sendMessage,
    showUnsupportedMessageAttachmentFormatError,
    submitMessageEdit,
    toggleMessageEmojiDropdown,
    updateMessageAttachmentDraft
  }
}
