import type { INmorphCustomFileData } from '@nmorph/nmorph-ui-kit'
import { MESSAGE_ATTACHMENT_LIMIT } from 'global-shared'
import { computed, useTemplateRef } from 'vue'

import { revokeObjectUrls, TOAST_I18N, useAppToast, useI18n } from 'src/shared/lib'

import { MESSAGE_ATTACHMENT_DRAFT_KIND, MESSAGE_DOCUMENT_MAX_MB, MESSAGE_IMAGE_MAX_MB } from '../config/constants'
import { CHAT_ROOM_CONTENT_I18N } from '../config/i18n'
import type {
  MessageAttachmentDraftListItem,
  MessageAttachmentUploadExpose,
  UseMessageAttachmentDraftParams
} from '../config/types'
import { buildMessageAttachmentDraftListItems } from '../lib/build-message-attachment-draft-list-items'
import { buildMessageAttachmentUploadGroups } from '../lib/build-message-attachment-upload-groups'

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
  const messageAttachmentDraftUploadValue = computed(() => [
    ...messageImageDraftUploadValue.value,
    ...messageDocumentDraftUploadValue.value
  ])
  const messageAttachmentDraftItems = computed(() =>
    buildMessageAttachmentDraftListItems(messageImageDraftImages.value, messageDocumentDraftDocuments.value)
  )
  const editingMessageAttachmentItems = computed(() =>
    buildMessageAttachmentDraftListItems(editingMessageImages.value, [])
  )
  const hasMessageAttachmentDraft = computed(() => hasMessageImageDraft.value || hasMessageDocumentDraft.value)

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
      sizeRejectedImageUploadValues,
      sizeRejectedDocumentUploadValues,
      limitRejectedUploadValues
    } = buildMessageAttachmentUploadGroups(uploadValues)
    const rejectedUploadValues = [
      ...sizeRejectedImageUploadValues,
      ...sizeRejectedDocumentUploadValues,
      ...limitRejectedUploadValues
    ]

    revokeObjectUrls(rejectedUploadValues.map(({ previewUrl }) => previewUrl))
    await Promise.all([
      updateMessageImageDraft(validImageUploadValues),
      updateMessageDocumentDraft(validDocumentUploadValues)
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

    if (limitRejectedUploadValues.length) {
      toast.add({
        type: 'warning',
        title: t(TOAST_I18N.warn),
        content: t(CHAT_ROOM_CONTENT_I18N.messageAttachmentLimitReached)(MESSAGE_ATTACHMENT_LIMIT)
      })
    }
  }

  const clearMessageAttachmentDraft = async () => {
    await Promise.all([clearMessageImageDraft(), clearMessageDocumentDraft()])
  }

  const clearSentMessageAttachmentDraft = () => {
    clearSentMessageImageDraft()
    clearSentMessageDocumentDraft()
  }

  const removeMessageAttachmentDraft = (attachment: MessageAttachmentDraftListItem) => {
    if (attachment.kind === MESSAGE_ATTACHMENT_DRAFT_KIND.IMAGE) {
      void removeMessageImageDraft(attachment.src)
      return
    }

    void removeMessageDocumentDraft(attachment.src)
  }

  const removeEditingMessageAttachment = (attachment: MessageAttachmentDraftListItem) => {
    removeEditingMessageImage(attachment.src)
  }

  return {
    editingMessageAttachmentItems,
    messageAttachmentDraftItems,
    messageAttachmentDraftUploadValue,
    messageDocumentDraftDocuments,
    messageImageDraftImages,
    hasMessageAttachmentDraft,
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
