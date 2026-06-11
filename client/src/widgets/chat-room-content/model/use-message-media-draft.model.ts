import type { INmorphCustomFileData } from '@nmorph/nmorph-ui-kit'
import type { MediaObject } from 'global-shared'
import { v4 as uuidv4 } from 'uuid'
import { computed, onBeforeUnmount, shallowRef } from 'vue'

import { useMedia } from 'src/entities/media-file'
import { revokeObjectUrl, revokeObjectUrls } from 'src/shared/lib'

import type { MessageMediaDraftItem, MessageMediaDraftObjectDetails, UseMessageMediaDraftParams } from '../config/types'
import {
  buildMessageMediaDraftObject,
  buildMessageMediaDraftPayloadObject
} from '../lib/build-message-draft-media-objects'

export const useMessageMediaDraft = <Media extends MediaObject>({
  draftMediaIdPrefix,
  mediaKind,
  buildMediaObjectDetails
}: UseMessageMediaDraftParams<Media>) => {
  const { put: putMedia, remove: removeMedia } = useMedia()
  const draftItems = shallowRef<MessageMediaDraftItem<Media>[]>([])
  const buildDetails = async (file: File): Promise<MessageMediaDraftObjectDetails<Media>> =>
    (await buildMediaObjectDetails?.(file)) ?? {}
  const mediaObjects = computed<Media[]>(() =>
    draftItems.value.map(({ details, file, id }) => buildMessageMediaDraftObject<Media>(file, id, details))
  )
  const uploadValues = computed(() => draftItems.value.map(({ uploadValue }) => uploadValue))
  const hasDraft = computed(() => draftItems.value.length > 0)

  const createDraftItem = async (uploadValue: INmorphCustomFileData) => {
    const { data: file } = uploadValue
    const id = `${draftMediaIdPrefix}-${uuidv4()}`
    const createdAt = Date.now()
    const details = await buildDetails(file)

    await putMedia({
      id,
      blob: file,
      contentType: file.type,
      etag: String(createdAt),
      kind: mediaKind,
      lastModified: new Date(file.lastModified).toUTCString(),
      lastChecked: createdAt,
      status: 'ready'
    })

    return {
      details,
      id,
      file,
      uploadValue
    } satisfies MessageMediaDraftItem<Media>
  }

  const deleteDraftItems = async (items: MessageMediaDraftItem<Media>[]) => {
    revokeObjectUrls(items.map(({ uploadValue }) => uploadValue.previewUrl))
    await Promise.all(items.map(({ id }) => removeMedia(id)))
  }

  const update = async (nextUploadValues: INmorphCustomFileData[]) => {
    const currentItemByPreviewUrl = new Map(draftItems.value.map((item) => [item.uploadValue.previewUrl, item]))
    const nextItems = await Promise.all(
      nextUploadValues.map(
        async (uploadValue) => currentItemByPreviewUrl.get(uploadValue.previewUrl) ?? createDraftItem(uploadValue)
      )
    )
    const nextItemIds = new Set(nextItems.map(({ id }) => id))
    const removedItems = draftItems.value.filter(({ id }) => !nextItemIds.has(id))

    await deleteDraftItems(removedItems)
    draftItems.value = nextItems
  }

  const remove = async (mediaSrc: string) => {
    const item = draftItems.value.find(({ id }) => id === mediaSrc)

    if (!item) return

    revokeObjectUrl(item.uploadValue.previewUrl)
    draftItems.value = draftItems.value.filter(({ id }) => id !== mediaSrc)
    await removeMedia(item.id)
  }

  const clear = async () => {
    const items = draftItems.value

    if (!items.length) return

    draftItems.value = []
    await deleteDraftItems(items)
  }

  const clearSent = () => {
    const items = draftItems.value

    if (!items.length) return

    draftItems.value = []
    revokeObjectUrls(items.map(({ uploadValue }) => uploadValue.previewUrl))
  }

  const buildPayload = () =>
    Promise.all(draftItems.value.map(({ details, file }) => buildMessageMediaDraftPayloadObject<Media>(file, details)))

  onBeforeUnmount(() => {
    void clear()
  })

  return {
    mediaObjects,
    uploadValues,
    hasDraft,
    buildPayload,
    clear,
    clearSent,
    remove,
    update
  }
}
