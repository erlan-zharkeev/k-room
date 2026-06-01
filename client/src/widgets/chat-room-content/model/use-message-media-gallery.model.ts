import { computed, ref } from 'vue'

import { useLiveMediaUrlMap } from 'src/shared/lib'

import type { MessageMediaGalleryProps } from '../config/types'
import { buildMessageMediaGalleryItems } from '../lib/build-message-media-gallery-items'

export const useMessageMediaGallery = (props: MessageMediaGalleryProps) => {
  const activeGalleryIndex = ref(0)
  const messageMediaIds = computed(() => [
    ...props.images.map(({ src }) => src),
    ...props.videos.map(({ src }) => src)
  ])
  const mediaUrlById = useLiveMediaUrlMap(() => messageMediaIds.value)
  const galleryItems = computed(() => buildMessageMediaGalleryItems(props.images, props.videos, mediaUrlById.value))
  const hasGalleryItems = computed(() => Boolean(galleryItems.value.length))

  return {
    activeGalleryIndex,
    galleryItems,
    hasGalleryItems
  }
}
