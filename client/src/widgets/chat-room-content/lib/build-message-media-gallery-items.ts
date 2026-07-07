import { isNumber, type ImageObject, type VideoObject } from 'global-shared'

import {
  MESSAGE_MEDIA_GALLERY_ITEM_MAX_ASPECT_RATIO,
  MESSAGE_MEDIA_GALLERY_ITEM_MIN_ASPECT_RATIO,
  MESSAGE_MEDIA_GALLERY_VIDEO_FALLBACK_ASPECT_RATIO
} from '../config/message-media-gallery.constants'
import type { MessageMediaGalleryItem } from '../config/types'

const resolveMessageMediaGalleryItemAspectRatio = (aspectRatio?: number) => {
  const hasFiniteAspectRatio = isNumber(aspectRatio) && Number.isFinite(aspectRatio)

  if (!hasFiniteAspectRatio) return undefined

  const hasPositiveAspectRatio = aspectRatio > 0

  if (!hasPositiveAspectRatio) return undefined

  return Math.min(
    MESSAGE_MEDIA_GALLERY_ITEM_MAX_ASPECT_RATIO,
    Math.max(MESSAGE_MEDIA_GALLERY_ITEM_MIN_ASPECT_RATIO, aspectRatio)
  )
}

const buildMessageMediaGalleryItemAspectRatioDetails = (aspectRatio?: number, fallbackAspectRatio?: number) => {
  const resolvedAspectRatio =
    resolveMessageMediaGalleryItemAspectRatio(aspectRatio) ??
    resolveMessageMediaGalleryItemAspectRatio(fallbackAspectRatio)

  return resolvedAspectRatio ? { aspectRatio: resolvedAspectRatio } : {}
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
        id: `${'image'}:${src}`,
        kind: 'image',
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
  videos.flatMap(({ aspectRatio, name, size, src }) => {
    const mediaUrl = mediaUrlById.get(src)

    if (!mediaUrl) return []

    return [
      {
        controls: true,
        downloadHref: mediaUrl,
        id: `${'video'}:${src}`,
        kind: 'video',
        mediaId: src,
        muted: false,
        name,
        playsinline: true,
        preload: 'metadata',
        size,
        src: mediaUrl,
        ...buildMessageMediaGalleryItemAspectRatioDetails(
          aspectRatio,
          MESSAGE_MEDIA_GALLERY_VIDEO_FALLBACK_ASPECT_RATIO
        )
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
