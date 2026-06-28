import { isNumber } from 'global-shared'
import { computed, ref } from 'vue'

import { useLiveMediaUrlMap } from 'src/shared/lib'

import {
  MESSAGE_MEDIA_GALLERY_ITEM_MAX_ASPECT_RATIO,
  MESSAGE_MEDIA_GALLERY_ITEM_MIN_ASPECT_RATIO,
  MESSAGE_MEDIA_GALLERY_SINGLE_ITEM_TARGET_HEIGHT_PX
} from '../config/constants'
import type { MessageMediaGalleryProps } from '../config/types'
import { buildMessageMediaGalleryItems } from '../lib/build-message-media-gallery-items'

const resolveMessageMediaGalleryAspectRatio = (aspectRatio?: number) => {
  const hasFiniteAspectRatio = isNumber(aspectRatio) && Number.isFinite(aspectRatio)

  if (!hasFiniteAspectRatio) return undefined
  if (aspectRatio <= 0) return undefined

  return Math.min(
    MESSAGE_MEDIA_GALLERY_ITEM_MAX_ASPECT_RATIO,
    Math.max(MESSAGE_MEDIA_GALLERY_ITEM_MIN_ASPECT_RATIO, aspectRatio)
  )
}

export const useMessageMediaGallery = (props: MessageMediaGalleryProps) => {
  const activeGalleryIndex = ref(0)
  const messageMediaIds = computed(() => [...props.images.map(({ src }) => src), ...props.videos.map(({ src }) => src)])
  const mediaUrlById = useLiveMediaUrlMap(() => messageMediaIds.value)
  const galleryItems = computed(() => buildMessageMediaGalleryItems(props.images, props.videos, mediaUrlById.value))
  const hasMediaItems = computed(() => Boolean(messageMediaIds.value.length))
  const hasGalleryItems = computed(() => Boolean(galleryItems.value.length))
  const singleAspectRatioItem = computed(() => {
    const [item] = galleryItems.value
    const hasSingleItem = galleryItems.value.length === 1

    return hasSingleItem && item?.aspectRatio ? item : undefined
  })
  const singleMediaAspectRatio = computed(() => {
    const hasSingleMediaItem = messageMediaIds.value.length === 1
    const [image] = props.images

    if (!hasSingleMediaItem) return undefined

    return singleAspectRatioItem.value?.aspectRatio ?? resolveMessageMediaGalleryAspectRatio(image?.aspectRatio)
  })
  const messageMediaGalleryStyle = computed(() => {
    const aspectRatio = singleMediaAspectRatio.value

    if (!aspectRatio) return undefined

    return {
      width: `${aspectRatio * MESSAGE_MEDIA_GALLERY_SINGLE_ITEM_TARGET_HEIGHT_PX}px`,
      maxWidth: '100%'
    }
  })
  const messageMediaGalleryPlaceholderStyle = computed(() => {
    const aspectRatio = singleMediaAspectRatio.value

    if (!aspectRatio) return undefined

    return {
      aspectRatio: String(aspectRatio)
    }
  })

  return {
    activeGalleryIndex,
    galleryItems,
    hasMediaItems,
    hasGalleryItems,
    messageMediaGalleryPlaceholderStyle,
    messageMediaGalleryStyle
  }
}
