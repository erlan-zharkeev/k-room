import type { INmorphCustomFileData } from '@nmorph/nmorph-ui-kit'
import type { DocumentObject } from 'global-shared'
import { v4 as uuidv4 } from 'uuid'
import { computed, onBeforeUnmount, ref } from 'vue'

import { MESSAGE_DOCUMENT_DRAFT_MEDIA_ID_PREFIX, useMedia } from 'src/entities/media-file'
import { revokeObjectUrl, revokeObjectUrls } from 'src/shared/lib'

import type { MessageDocumentDraftItem } from '../config/types'

export const useMessageDocumentDraft = () => {
  const { put: putMedia, remove: removeMedia } = useMedia()
  const messageDocumentDraftItems = ref<MessageDocumentDraftItem[]>([])
  const messageDocumentDraftDocuments = computed<DocumentObject[]>(() =>
    messageDocumentDraftItems.value.map(({ file, id }) => ({
      src: id,
      name: file.name,
      contentType: file.type,
      size: file.size
    }))
  )
  const messageDocumentDraftUploadValue = computed(() =>
    messageDocumentDraftItems.value.map(({ uploadValue }) => uploadValue)
  )
  const hasMessageDocumentDraft = computed(() => messageDocumentDraftItems.value.length > 0)

  const createMessageDocumentDraftItem = async (uploadValue: INmorphCustomFileData) => {
    const { data: file } = uploadValue
    const id = `${MESSAGE_DOCUMENT_DRAFT_MEDIA_ID_PREFIX}-${uuidv4()}`
    const createdAt = Date.now()

    await putMedia({
      id,
      blob: file,
      contentType: file.type,
      etag: String(createdAt),
      kind: 'pdf',
      lastModified: new Date(file.lastModified).toUTCString(),
      lastChecked: createdAt,
      status: 'ready'
    })

    return {
      id,
      file,
      uploadValue
    } satisfies MessageDocumentDraftItem
  }

  const deleteMessageDocumentDraftItems = async (items: MessageDocumentDraftItem[]) => {
    revokeObjectUrls(items.map(({ uploadValue }) => uploadValue.previewUrl))
    await Promise.all(items.map(({ id }) => removeMedia(id)))
  }

  const updateMessageDocumentDraft = async (uploadValues: INmorphCustomFileData[]) => {
    const currentItemByPreviewUrl = new Map(
      messageDocumentDraftItems.value.map((item) => [item.uploadValue.previewUrl, item])
    )
    const nextItems = await Promise.all(
      uploadValues.map(
        async (uploadValue) =>
          currentItemByPreviewUrl.get(uploadValue.previewUrl) ?? createMessageDocumentDraftItem(uploadValue)
      )
    )
    const nextItemIds = new Set(nextItems.map(({ id }) => id))
    const removedItems = messageDocumentDraftItems.value.filter(({ id }) => !nextItemIds.has(id))

    await deleteMessageDocumentDraftItems(removedItems)
    messageDocumentDraftItems.value = nextItems
  }

  const removeMessageDocumentDraft = async (documentSrc: string) => {
    const item = messageDocumentDraftItems.value.find(({ id }) => id === documentSrc)

    if (!item) return

    revokeObjectUrl(item.uploadValue.previewUrl)
    messageDocumentDraftItems.value = messageDocumentDraftItems.value.filter(({ id }) => id !== documentSrc)
    await removeMedia(item.id)
  }

  const clearMessageDocumentDraft = async () => {
    const items = messageDocumentDraftItems.value

    if (!items.length) return

    messageDocumentDraftItems.value = []
    await deleteMessageDocumentDraftItems(items)
  }

  const clearSentMessageDocumentDraft = () => {
    const items = messageDocumentDraftItems.value

    if (!items.length) return

    messageDocumentDraftItems.value = []
    revokeObjectUrls(items.map(({ uploadValue }) => uploadValue.previewUrl))
  }

  const buildMessageDocumentDraftPayload = () =>
    Promise.all(
      messageDocumentDraftItems.value.map(
        async ({ file }) =>
          ({
            src: file.name,
            name: file.name,
            contentType: file.type,
            size: file.size,
            fileBuffer: await file.arrayBuffer()
          } satisfies DocumentObject)
      )
    )

  onBeforeUnmount(() => {
    void clearMessageDocumentDraft()
  })

  return {
    messageDocumentDraftDocuments,
    messageDocumentDraftUploadValue,
    hasMessageDocumentDraft,
    buildMessageDocumentDraftPayload,
    clearMessageDocumentDraft,
    clearSentMessageDocumentDraft,
    removeMessageDocumentDraft,
    updateMessageDocumentDraft
  }
}
