import type { INmorphCustomFileData } from '@nmorph/nmorph-ui-kit'
import type { ImageObject } from 'global-shared'
import { v4 as uuidv4 } from 'uuid'
import { computed, onBeforeUnmount, ref } from 'vue'

import { MESSAGE_IMAGE_DRAFT_MEDIA_ID_PREFIX, useMedia } from 'src/entities/media-file'
import { revokeObjectUrl, revokeObjectUrls } from 'src/shared/lib'

import type { MessageImageDraftItem } from '../config/types'

export const useMessageImageDraft = () => {
  const { put: putMedia, remove: removeMedia } = useMedia()
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
    const id = `${MESSAGE_IMAGE_DRAFT_MEDIA_ID_PREFIX}-${uuidv4()}`
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

  const updateMessageImageDraft = async (uploadValues: INmorphCustomFileData[]) => {
    const currentItemByPreviewUrl = new Map(
      messageImageDraftItems.value.map((item) => [item.uploadValue.previewUrl, item])
    )
    const nextItems = await Promise.all(
      uploadValues.map(
        async (uploadValue) =>
          currentItemByPreviewUrl.get(uploadValue.previewUrl) ?? createMessageImageDraftItem(uploadValue)
      )
    )
    const nextItemIds = new Set(nextItems.map(({ id }) => id))
    const removedItems = messageImageDraftItems.value.filter(({ id }) => !nextItemIds.has(id))

    await deleteMessageImageDraftItems(removedItems)
    messageImageDraftItems.value = nextItems
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

  const clearSentMessageImageDraft = () => {
    const items = messageImageDraftItems.value

    if (!items.length) return

    messageImageDraftItems.value = []
    revokeObjectUrls(items.map(({ uploadValue }) => uploadValue.previewUrl))
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
    clearSentMessageImageDraft,
    removeMessageImageDraft,
    updateMessageImageDraft
  }
}
