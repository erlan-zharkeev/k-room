import type { INmorphCustomFileData } from '@nmorph/nmorph-ui-kit'
import { MESSAGE_ATTACHMENT_LIMIT, type AudioObject, type DocumentObject, type ImageObject } from 'global-shared'
import { computed, useTemplateRef } from 'vue'

import {
  MESSAGE_AUDIO_DRAFT_MEDIA_ID_PREFIX,
  MESSAGE_DOCUMENT_DRAFT_MEDIA_ID_PREFIX,
  MESSAGE_IMAGE_DRAFT_MEDIA_ID_PREFIX
} from 'src/entities/media-file'
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
import { buildMessageFileDraftObjectDetails } from '../lib/build-message-draft-media-objects'

import { useMessageMediaDraft } from './use-message-media-draft.model'

export const useMessageAttachmentDraft = ({
  editingMessageImages,
  removeEditingMessageImage
}: UseMessageAttachmentDraftParams) => {
  const { t } = useI18n()
  const toast = useAppToast()
  const messageAttachmentUploadRef = useTemplateRef<MessageAttachmentUploadExpose>('messageAttachmentUpload')
  const messageImageDraft = useMessageMediaDraft<ImageObject>({
    draftMediaIdPrefix: MESSAGE_IMAGE_DRAFT_MEDIA_ID_PREFIX,
    mediaKind: 'image'
  })
  const messageDocumentDraft = useMessageMediaDraft<DocumentObject>({
    draftMediaIdPrefix: MESSAGE_DOCUMENT_DRAFT_MEDIA_ID_PREFIX,
    mediaKind: 'pdf',
    buildMediaObjectDetails: buildMessageFileDraftObjectDetails
  })
  const messageAudioDraft = useMessageMediaDraft<AudioObject>({
    draftMediaIdPrefix: MESSAGE_AUDIO_DRAFT_MEDIA_ID_PREFIX,
    mediaKind: 'audio',
    buildMediaObjectDetails: buildMessageFileDraftObjectDetails
  })
  const messageAttachmentDraftUploadValue = computed(() => [
    ...messageImageDraft.uploadValues.value,
    ...messageDocumentDraft.uploadValues.value,
    ...messageAudioDraft.uploadValues.value
  ])
  const messageAttachmentDraftItems = computed(() =>
    buildMessageAttachmentDraftListItems(
      messageImageDraft.mediaObjects.value,
      messageDocumentDraft.mediaObjects.value,
      messageAudioDraft.mediaObjects.value
    )
  )
  const editingMessageAttachmentItems = computed(() =>
    buildMessageAttachmentDraftListItems(editingMessageImages.value, [], [])
  )
  const hasMessageImageOrDocumentDraft = computed(
    () => messageImageDraft.hasDraft.value || messageDocumentDraft.hasDraft.value
  )
  const hasMessageAttachmentDraft = computed(
    () => hasMessageImageOrDocumentDraft.value || messageAudioDraft.hasDraft.value
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
      messageImageDraft.update(validImageUploadValues),
      messageDocumentDraft.update(validDocumentUploadValues),
      messageAudioDraft.update(validAudioUploadValues)
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
    await Promise.all([messageImageDraft.clear(), messageDocumentDraft.clear(), messageAudioDraft.clear()])
  }

  const clearSentMessageAttachmentDraft = () => {
    messageImageDraft.clearSent()
    messageDocumentDraft.clearSent()
    messageAudioDraft.clearSent()
  }

  const removeMessageAttachmentDraft = (attachment: MessageAttachmentDraftListItem) => {
    if (attachment.kind === MESSAGE_ATTACHMENT_DRAFT_KIND.IMAGE) {
      void messageImageDraft.remove(attachment.src)
      return
    }

    if (attachment.kind === MESSAGE_ATTACHMENT_DRAFT_KIND.DOCUMENT) {
      void messageDocumentDraft.remove(attachment.src)
      return
    }

    void messageAudioDraft.remove(attachment.src)
  }

  const removeEditingMessageAttachment = (attachment: MessageAttachmentDraftListItem) => {
    removeEditingMessageImage(attachment.src)
  }

  return {
    editingMessageAttachmentItems,
    messageAttachmentDraftItems,
    messageAttachmentDraftUploadValue,
    messageAudioDraftAudios: messageAudioDraft.mediaObjects,
    messageDocumentDraftDocuments: messageDocumentDraft.mediaObjects,
    messageImageDraftImages: messageImageDraft.mediaObjects,
    hasMessageAttachmentDraft,
    buildMessageAudioDraftPayload: messageAudioDraft.buildPayload,
    buildMessageDocumentDraftPayload: messageDocumentDraft.buildPayload,
    buildMessageImageDraftPayload: messageImageDraft.buildPayload,
    clearMessageAttachmentDraft,
    clearSentMessageAttachmentDraft,
    openMessageAttachmentUpload,
    removeEditingMessageAttachment,
    removeMessageAttachmentDraft,
    showUnsupportedMessageAttachmentFormatError,
    updateMessageAttachmentDraft
  }
}
