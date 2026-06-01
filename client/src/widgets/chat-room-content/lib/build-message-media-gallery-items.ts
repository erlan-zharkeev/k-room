import type { ImageObject, VideoObject } from 'global-shared'

import { MESSAGE_MEDIA_GALLERY_ITEM_KIND } from '../config/constants'
import type { MessageMediaGalleryItem } from '../config/types'

const buildMessageImageMediaGalleryItems = (
  images: ImageObject[],
  mediaUrlById: Map<string, string>
): MessageMediaGalleryItem[] =>
  images.flatMap(({ name, size, src }) => {
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
        src: mediaUrl
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
