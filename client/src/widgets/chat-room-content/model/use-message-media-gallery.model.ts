import { computed, ref } from 'vue'

import { useLiveMediaUrlMap } from 'src/shared/lib'

import { MESSAGE_MEDIA_GALLERY_SINGLE_ITEM_TARGET_HEIGHT_PX } from '../config/constants'
import type { MessageMediaGalleryProps } from '../config/types'
import { buildMessageMediaGalleryItems } from '../lib/build-message-media-gallery-items'

export const useMessageMediaGallery = (props: MessageMediaGalleryProps) => {
  const activeGalleryIndex = ref(0)
  const messageMediaIds = computed(() => [...props.images.map(({ src }) => src), ...props.videos.map(({ src }) => src)])
  const mediaUrlById = useLiveMediaUrlMap(() => messageMediaIds.value)
  const galleryItems = computed(() => buildMessageMediaGalleryItems(props.images, props.videos, mediaUrlById.value))
  const hasGalleryItems = computed(() => Boolean(galleryItems.value.length))
  const singleAspectRatioItem = computed(() => {
    const [item] = galleryItems.value
    const hasSingleItem = galleryItems.value.length === 1

    return hasSingleItem && item?.aspectRatio ? item : undefined
  })
  const messageMediaGalleryStyle = computed(() => {
    const aspectRatio = singleAspectRatioItem.value?.aspectRatio

    if (!aspectRatio) return undefined

    return {
      width: `${aspectRatio * MESSAGE_MEDIA_GALLERY_SINGLE_ITEM_TARGET_HEIGHT_PX}px`,
      maxWidth: '100%'
    }
  })

  return {
    activeGalleryIndex,
    galleryItems,
    hasGalleryItems,
    messageMediaGalleryStyle
  }
}
