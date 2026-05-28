import type { INmorphCustomFileData } from '@nmorph/nmorph-ui-kit'
import { MESSAGE_IMAGE_LIMIT, type ImageObject } from 'global-shared'
import { v4 as uuidv4 } from 'uuid'
import { computed, onBeforeUnmount, ref, useTemplateRef } from 'vue'

import { useMedia } from 'src/entities/media-file'
import { revokeObjectUrl, revokeObjectUrls, TOAST_I18N, useAppToast, useI18n } from 'src/shared/lib'

import {
  MESSAGE_IMAGE_DRAFT_MEDIA_ID_PREFIX,
  MESSAGE_IMAGE_MAX_FILE_SIZE,
  MESSAGE_IMAGE_MAX_MB
} from '../config/constants'
import { CHAT_ROOM_CONTENT_I18N } from '../config/i18n'
import type { MessageImageDraftItem, MessageImageUploadRef } from '../config/types'

const buildMessageImageDraftMediaId = () => `${MESSAGE_IMAGE_DRAFT_MEDIA_ID_PREFIX}-${uuidv4()}`

export const useMessageImageDraft = () => {
  const { put: putMedia, remove: removeMedia } = useMedia()
  const { t } = useI18n()
  const toast = useAppToast()
  const messageImageUploadRef = useTemplateRef<MessageImageUploadRef>('messageImageUpload')
  const messageImageDraftItems = ref<MessageImageDraftItem[]>([])
  const messageImageDraftImages = computed<ImageObject[]>(() =>
    messageImageDraftItems.value.map(({ file, id }) => ({
      src: id,
      name: file.name
    }))
  )
  const messageImageDraftUploadValue = computed(() =>
    messageImageDraftItems.value.map(({ uploadValue }) => uploadValue)
  )
  const hasMessageImageDraft = computed(() => messageImageDraftItems.value.length > 0)

  const createMessageImageDraftItem = async (uploadValue: INmorphCustomFileData) => {
    const { data: file } = uploadValue
    const id = buildMessageImageDraftMediaId()
    const createdAt = Date.now()

    await putMedia({
      id,
      blob: file,
      contentType: file.type,
      etag: String(createdAt),
      kind: 'image',
      lastModified: new Date(file.lastModified).toUTCString(),
      lastChecked: createdAt,
      status: 'ready'
    })

    return {
      id,
      file,
      uploadValue
    } satisfies MessageImageDraftItem
  }

  const deleteMessageImageDraftItems = async (items: MessageImageDraftItem[]) => {
    revokeObjectUrls(items.map(({ uploadValue }) => uploadValue.previewUrl))
    await Promise.all(items.map(({ id }) => removeMedia(id)))
  }

  const openMessageImageUpload = () => {
    const input = messageImageUploadRef.value?.inputDOMRef

    if (!input) return

    input.click()
  }

  const showUnsupportedMessageImageFormatError = () => {
    toast.add({
      type: 'error',
      title: t(TOAST_I18N.error),
      content: t(CHAT_ROOM_CONTENT_I18N.messageImageInvalidFormat)
    })
  }

  const updateMessageImageDraft = async (uploadValues: INmorphCustomFileData[]) => {
    const sizeValidUploadValues = uploadValues.filter(({ data }) => data.size <= MESSAGE_IMAGE_MAX_FILE_SIZE)
    const sizeRejectedUploadValues = uploadValues.filter(({ data }) => data.size > MESSAGE_IMAGE_MAX_FILE_SIZE)
    const validUploadValues = sizeValidUploadValues.slice(0, MESSAGE_IMAGE_LIMIT)
    const limitRejectedUploadValues = sizeValidUploadValues.slice(MESSAGE_IMAGE_LIMIT)

    revokeObjectUrls([...sizeRejectedUploadValues, ...limitRejectedUploadValues].map(({ previewUrl }) => previewUrl))

    const currentItemByPreviewUrl = new Map(
      messageImageDraftItems.value.map((item) => [item.uploadValue.previewUrl, item])
    )
    const nextItems = await Promise.all(
      validUploadValues.map(
        async (uploadValue) =>
          currentItemByPreviewUrl.get(uploadValue.previewUrl) ?? createMessageImageDraftItem(uploadValue)
      )
    )
    const nextItemIds = new Set(nextItems.map(({ id }) => id))
    const removedItems = messageImageDraftItems.value.filter(({ id }) => !nextItemIds.has(id))

    await deleteMessageImageDraftItems(removedItems)
    messageImageDraftItems.value = nextItems

    if (sizeRejectedUploadValues.length) {
      toast.add({
        type: 'error',
        title: t(TOAST_I18N.error),
        content: t(CHAT_ROOM_CONTENT_I18N.messageImageInvalidSize)(MESSAGE_IMAGE_MAX_MB)
      })
    }

    if (limitRejectedUploadValues.length) {
      toast.add({
        type: 'warning',
        title: t(TOAST_I18N.warn),
        content: t(CHAT_ROOM_CONTENT_I18N.messageImageLimitReached)(MESSAGE_IMAGE_LIMIT)
      })
    }
  }

  const removeMessageImageDraft = async (imageSrc: string) => {
    const item = messageImageDraftItems.value.find(({ id }) => id === imageSrc)

    if (!item) return

    revokeObjectUrl(item.uploadValue.previewUrl)
    messageImageDraftItems.value = messageImageDraftItems.value.filter(({ id }) => id !== imageSrc)
    await removeMedia(item.id)
  }

  const clearMessageImageDraft = async () => {
    const items = messageImageDraftItems.value

    if (!items.length) return

    messageImageDraftItems.value = []
    await deleteMessageImageDraftItems(items)
  }

  const buildMessageImageDraftPayload = () =>
    Promise.all(
      messageImageDraftItems.value.map(
        async ({ file }) =>
          ({
            src: file.name,
            name: file.name,
            fileBuffer: await file.arrayBuffer()
          } satisfies ImageObject)
      )
    )

  onBeforeUnmount(() => {
    void clearMessageImageDraft()
  })

  return {
    messageImageDraftImages,
    messageImageDraftUploadValue,
    hasMessageImageDraft,
    buildMessageImageDraftPayload,
    clearMessageImageDraft,
    openMessageImageUpload,
    removeMessageImageDraft,
    showUnsupportedMessageImageFormatError,
    updateMessageImageDraft
  }
}
