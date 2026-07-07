import type { ImageObject, VideoObject } from 'global-shared'
import { describe, expect, it, vi } from 'vitest'

vi.stubGlobal('__CLIENT_ENV_DATA__', {
  appName: 'K-ROOM'
})

const { MESSAGE_MEDIA_GALLERY_VIDEO_FALLBACK_ASPECT_RATIO } = await import('../config/message-media-gallery.constants')
const { buildMessageMediaGalleryItems } = await import('./build-message-media-gallery-items')

describe('buildMessageMediaGalleryItems', () => {
  it('adds image aspect ratio to gallery item', () => {
    const images: ImageObject[] = [{ src: 'image-1', name: 'image.png', aspectRatio: 4 / 3 }]
    const mediaUrlById = new Map([['image-1', 'blob:image-1']])

    expect(buildMessageMediaGalleryItems(images, [], mediaUrlById)[0]).toMatchObject({
      aspectRatio: 4 / 3,
      kind: 'image',
      src: 'blob:image-1'
    })
  })

  it('uses video aspect ratio when it is available', () => {
    const videos: VideoObject[] = [{ src: 'video-1', name: 'video.mp4', aspectRatio: 9 / 16 }]
    const mediaUrlById = new Map([['video-1', 'blob:video-1']])

    expect(buildMessageMediaGalleryItems([], videos, mediaUrlById)[0]).toMatchObject({
      aspectRatio: 0.65,
      kind: 'video',
      src: 'blob:video-1'
    })
  })

  it('uses stable fallback aspect ratio for video without metadata', () => {
    const videos: VideoObject[] = [{ src: 'video-1', name: 'video.mp4' }]
    const mediaUrlById = new Map([['video-1', 'blob:video-1']])

    expect(buildMessageMediaGalleryItems([], videos, mediaUrlById)[0]).toMatchObject({
      aspectRatio: MESSAGE_MEDIA_GALLERY_VIDEO_FALLBACK_ASPECT_RATIO,
      kind: 'video',
      src: 'blob:video-1'
    })
  })
})
