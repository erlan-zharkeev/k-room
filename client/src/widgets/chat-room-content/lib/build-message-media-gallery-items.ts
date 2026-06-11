import { isNumber, type ImageObject, type VideoObject } from 'global-shared'

import {
  MESSAGE_MEDIA_GALLERY_ITEM_KIND,
  MESSAGE_MEDIA_GALLERY_ITEM_MAX_ASPECT_RATIO,
  MESSAGE_MEDIA_GALLERY_ITEM_MIN_ASPECT_RATIO
} from '../config/constants'
import type { MessageMediaGalleryItem } from '../config/types'

const buildMessageMediaGalleryItemAspectRatioDetails = (aspectRatio?: number) => {
  const hasFiniteAspectRatio = isNumber(aspectRatio) && Number.isFinite(aspectRatio)

  if (!hasFiniteAspectRatio) return {}

  const hasPositiveAspectRatio = aspectRatio > 0

  if (!hasPositiveAspectRatio) return {}

  return {
    aspectRatio: Math.min(
      MESSAGE_MEDIA_GALLERY_ITEM_MAX_ASPECT_RATIO,
      Math.max(MESSAGE_MEDIA_GALLERY_ITEM_MIN_ASPECT_RATIO, aspectRatio)
    )
  }
}

const buildMessageImageMediaGalleryItems = (
  images: ImageObject[],
  mediaUrlById: Map<string, string>
): MessageMediaGalleryItem[] =>
  images.flatMap(({ aspectRatio, name, size, src }) => {
    const mediaUrl = mediaUrlById.get(src)

    if (!mediaUrl) return []

    return [
      {
        alt: name,
        downloadHref: mediaUrl,
        id: `${MESSAGE_MEDIA_GALLERY_ITEM_KIND.IMAGE}:${src}`,
        kind: MESSAGE_MEDIA_GALLERY_ITEM_KIND.IMAGE,
        mediaId: src,
        name,
        size,
        src: mediaUrl,
        ...buildMessageMediaGalleryItemAspectRatioDetails(aspectRatio)
      }
    ]
  })

const buildMessageVideoMediaGalleryItems = (
  videos: VideoObject[],
  mediaUrlById: Map<string, string>
): MessageMediaGalleryItem[] =>
  videos.flatMap(({ name, size, src }) => {
    const mediaUrl = mediaUrlById.get(src)

    if (!mediaUrl) return []

    return [
      {
        controls: true,
        downloadHref: mediaUrl,
        id: `${MESSAGE_MEDIA_GALLERY_ITEM_KIND.VIDEO}:${src}`,
        kind: MESSAGE_MEDIA_GALLERY_ITEM_KIND.VIDEO,
        mediaId: src,
        muted: false,
        name,
        playsinline: true,
        preload: 'metadata',
        size,
        src: mediaUrl
      }
    ]
  })

export const buildMessageMediaGalleryItems = (
  images: ImageObject[],
  videos: VideoObject[],
  mediaUrlById: Map<string, string>
): MessageMediaGalleryItem[] => [
  ...buildMessageImageMediaGalleryItems(images, mediaUrlById),
  ...buildMessageVideoMediaGalleryItems(videos, mediaUrlById)
]
