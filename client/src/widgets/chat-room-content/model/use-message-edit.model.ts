import { MESSAGE_BODY_MAX_LENGTH, MESSAGE_STATUS_VALUE, type EventEditMessage, type ImageObject } from 'global-shared'
import { computed, ref } from 'vue'

import { useSocketAction } from 'src/shared/api'
import type { MessageRecord } from 'src/shared/lib'

import type { EditingMessageState } from '../config/types'
import { hasMessageImageChanges } from '../lib/has-message-image-changes'

const editingMessageState = ref<EditingMessageState | null>(null)
const messageEditText = ref('')
const editingMessageImages = ref<ImageObject[]>([])
const isUpdatingEditedMessage = ref(false)

export const useMessageEdit = () => {
  const { emitSocketAction } = useSocketAction()
  const isMessageEditActive = computed(() => Boolean(editingMessageState.value))
  const editingMessagePreviewText = computed(() => editingMessageState.value?.initialBody ?? '')
  const editingMessageId = computed(() => editingMessageState.value?.messageId)
  const canSubmitMessageEdit = computed(() => {
    const state = editingMessageState.value

    if (!state) return false

    const body = messageEditText.value.trim()
    const isValidBody = Boolean(body) && body.length <= MESSAGE_BODY_MAX_LENGTH
    const hasChangedBody = body !== state.initialBody
    const hasChangedImages = hasMessageImageChanges(state.initialImages, editingMessageImages.value)
    const hasChangedDraft = hasChangedBody || hasChangedImages
    const canSubmitDraft = isValidBody && hasChangedDraft

    return canSubmitDraft && !isUpdatingEditedMessage.value
  })

  const canStartMessageEdit = (message: MessageRecord) => {
    const isOwnMessage = Boolean(message.isSelf)
    const hasEditableBody = Boolean(message.body.trim())
    const isSendingMessage = message.status === MESSAGE_STATUS_VALUE.SENDING
    const hasEditableMessage = isOwnMessage && hasEditableBody

    return hasEditableMessage && !isSendingMessage
  }

  const startMessageEdit = (message: MessageRecord, roomId: string) => {
    if (!canStartMessageEdit(message) || isUpdatingEditedMessage.value) return

    editingMessageState.value = {
      roomId,
      messageId: message.id,
      initialBody: message.body,
      initialImages: (message.images ?? []).map((image) => ({ ...image }))
    }
    messageEditText.value = message.body
    editingMessageImages.value = (message.images ?? []).map((image) => ({ ...image }))
  }

  const cancelMessageEdit = () => {
    editingMessageState.value = null
    messageEditText.value = ''
    editingMessageImages.value = []
  }

  const isEditingRoomMessage = (roomId: string) => editingMessageState.value?.roomId === roomId
  const isEditingMessage = (roomId: string, messageId: string) => {
    const state = editingMessageState.value

    if (!state) return false

    return state.roomId === roomId && state.messageId === messageId
  }

  const removeEditingMessageImage = (imageSrc: string) => {
    editingMessageImages.value = editingMessageImages.value.filter(({ src }) => src !== imageSrc)
  }

  const submitMessageEdit = () => {
    const state = editingMessageState.value

    if (!state || !canSubmitMessageEdit.value) return

    const payload: EventEditMessage = {
      roomId: state.roomId,
      messageId: state.messageId,
      body: messageEditText.value.trim(),
      images: editingMessageImages.value
    }

    isUpdatingEditedMessage.value = true
    void emitSocketAction<EventEditMessage>('edit-message', payload, {
      onSuccess: () => {
        cancelMessageEdit()
      },
      onSettled: () => {
        isUpdatingEditedMessage.value = false
      }
    })
  }

  return {
    editingMessageState,
    editingMessagePreviewText,
    editingMessageId,
    editingMessageImages,
    messageEditText,
    isMessageEditActive,
    isUpdatingEditedMessage,
    canSubmitMessageEdit,
    canStartMessageEdit,
    startMessageEdit,
    cancelMessageEdit,
    isEditingRoomMessage,
    isEditingMessage,
    removeEditingMessageImage,
    submitMessageEdit
  }
}
