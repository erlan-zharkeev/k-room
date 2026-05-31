import type { INmorphCustomFileData } from '@nmorph/nmorph-ui-kit'
import { MESSAGE_ATTACHMENT_LIMIT } from 'global-shared'
import { computed, useTemplateRef } from 'vue'

import { revokeObjectUrls, TOAST_I18N, useAppToast, useI18n } from 'src/shared/lib'

import {
  MESSAGE_ATTACHMENT_DRAFT_KIND,
  MESSAGE_AUDIO_MAX_MB,
  MESSAGE_DOCUMENT_MAX_MB,
  MESSAGE_IMAGE_MAX_MB
} from '../config/constants'
import { CHAT_ROOM_CONTENT_I18N } from '../config/i18n'
import type {
  MessageAttachmentDraftListItem,
  MessageAttachmentUploadExpose,
  UseMessageAttachmentDraftParams
} from '../config/types'
import { buildMessageAttachmentDraftListItems } from '../lib/build-message-attachment-draft-list-items'
import { buildMessageAttachmentUploadGroups } from '../lib/build-message-attachment-upload-groups'

import { useMessageAudioDraft } from './use-message-audio-draft.model'
import { useMessageDocumentDraft } from './use-message-document-draft.model'
import { useMessageImageDraft } from './use-message-image-draft.model'

export const useMessageAttachmentDraft = ({
  editingMessageImages,
  removeEditingMessageImage
}: UseMessageAttachmentDraftParams) => {
  const { t } = useI18n()
  const toast = useAppToast()
  const messageAttachmentUploadRef = useTemplateRef<MessageAttachmentUploadExpose>('messageAttachmentUpload')
  const {
    buildMessageImageDraftPayload,
    clearMessageImageDraft,
    clearSentMessageImageDraft,
    hasMessageImageDraft,
    messageImageDraftImages,
    messageImageDraftUploadValue,
    removeMessageImageDraft,
    updateMessageImageDraft
  } = useMessageImageDraft()
  const {
    buildMessageDocumentDraftPayload,
    clearMessageDocumentDraft,
    clearSentMessageDocumentDraft,
    hasMessageDocumentDraft,
    messageDocumentDraftDocuments,
    messageDocumentDraftUploadValue,
    removeMessageDocumentDraft,
    updateMessageDocumentDraft
  } = useMessageDocumentDraft()
  const {
    buildMessageAudioDraftPayload,
    clearMessageAudioDraft,
    clearSentMessageAudioDraft,
    hasMessageAudioDraft,
    messageAudioDraftAudios,
    messageAudioDraftUploadValue,
    removeMessageAudioDraft,
    updateMessageAudioDraft
  } = useMessageAudioDraft()
  const messageAttachmentDraftUploadValue = computed(() => [
    ...messageImageDraftUploadValue.value,
    ...messageDocumentDraftUploadValue.value,
    ...messageAudioDraftUploadValue.value
  ])
  const messageAttachmentDraftItems = computed(() =>
    buildMessageAttachmentDraftListItems(
      messageImageDraftImages.value,
      messageDocumentDraftDocuments.value,
      messageAudioDraftAudios.value
    )
  )
  const editingMessageAttachmentItems = computed(() =>
    buildMessageAttachmentDraftListItems(editingMessageImages.value, [], [])
  )
  const hasMessageImageOrDocumentDraft = computed(() => hasMessageImageDraft.value || hasMessageDocumentDraft.value)
  const hasMessageAttachmentDraft = computed(
    () => hasMessageImageOrDocumentDraft.value || hasMessageAudioDraft.value
  )

  const openMessageAttachmentUpload = () => {
    const input = messageAttachmentUploadRef.value?.inputDOMRef

    if (!input) return

    input.click()
  }

  const showUnsupportedMessageAttachmentFormatError = () => {
    toast.add({
      type: 'error',
      title: t(TOAST_I18N.error),
      content: t(CHAT_ROOM_CONTENT_I18N.messageAttachmentInvalidFormat)
    })
  }

  const updateMessageAttachmentDraft = async (uploadValues: INmorphCustomFileData[]) => {
    const {
      validImageUploadValues,
      validDocumentUploadValues,
      validAudioUploadValues,
      sizeRejectedImageUploadValues,
      sizeRejectedDocumentUploadValues,
      sizeRejectedAudioUploadValues,
      limitRejectedUploadValues
    } = buildMessageAttachmentUploadGroups(uploadValues)
    const rejectedUploadValues = [
      ...sizeRejectedImageUploadValues,
      ...sizeRejectedDocumentUploadValues,
      ...sizeRejectedAudioUploadValues,
      ...limitRejectedUploadValues
    ]

    revokeObjectUrls(rejectedUploadValues.map(({ previewUrl }) => previewUrl))
    await Promise.all([
      updateMessageImageDraft(validImageUploadValues),
      updateMessageDocumentDraft(validDocumentUploadValues),
      updateMessageAudioDraft(validAudioUploadValues)
    ])

    if (sizeRejectedImageUploadValues.length) {
      toast.add({
        type: 'error',
        title: t(TOAST_I18N.error),
        content: t(CHAT_ROOM_CONTENT_I18N.messageImageInvalidSize)(MESSAGE_IMAGE_MAX_MB)
      })
    }

    if (sizeRejectedDocumentUploadValues.length) {
      toast.add({
        type: 'error',
        title: t(TOAST_I18N.error),
        content: t(CHAT_ROOM_CONTENT_I18N.messageDocumentInvalidSize)(MESSAGE_DOCUMENT_MAX_MB)
      })
    }

    if (sizeRejectedAudioUploadValues.length) {
      toast.add({
        type: 'error',
        title: t(TOAST_I18N.error),
        content: t(CHAT_ROOM_CONTENT_I18N.messageAudioInvalidSize)(MESSAGE_AUDIO_MAX_MB)
      })
    }

    if (limitRejectedUploadValues.length) {
      toast.add({
        type: 'warning',
        title: t(TOAST_I18N.warn),
        content: t(CHAT_ROOM_CONTENT_I18N.messageAttachmentLimitReached)(MESSAGE_ATTACHMENT_LIMIT)
      })
    }
  }

  const clearMessageAttachmentDraft = async () => {
    await Promise.all([clearMessageImageDraft(), clearMessageDocumentDraft(), clearMessageAudioDraft()])
  }

  const clearSentMessageAttachmentDraft = () => {
    clearSentMessageImageDraft()
    clearSentMessageDocumentDraft()
    clearSentMessageAudioDraft()
  }

  const removeMessageAttachmentDraft = (attachment: MessageAttachmentDraftListItem) => {
    if (attachment.kind === MESSAGE_ATTACHMENT_DRAFT_KIND.IMAGE) {
      void removeMessageImageDraft(attachment.src)
      return
    }

    if (attachment.kind === MESSAGE_ATTACHMENT_DRAFT_KIND.DOCUMENT) {
      void removeMessageDocumentDraft(attachment.src)
      return
    }

    void removeMessageAudioDraft(attachment.src)
  }

  const removeEditingMessageAttachment = (attachment: MessageAttachmentDraftListItem) => {
    removeEditingMessageImage(attachment.src)
  }

  return {
    editingMessageAttachmentItems,
    messageAttachmentDraftItems,
    messageAttachmentDraftUploadValue,
    messageAudioDraftAudios,
    messageDocumentDraftDocuments,
    messageImageDraftImages,
    hasMessageAttachmentDraft,
    buildMessageAudioDraftPayload,
    buildMessageDocumentDraftPayload,
    buildMessageImageDraftPayload,
    clearMessageAttachmentDraft,
    clearSentMessageAttachmentDraft,
    openMessageAttachmentUpload,
    removeEditingMessageAttachment,
    removeMessageAttachmentDraft,
    showUnsupportedMessageAttachmentFormatError,
    updateMessageAttachmentDraft
  }
}
