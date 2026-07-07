import type { ImageObject, MediaObject, VideoObject } from 'global-shared'

import type { MessageMediaDraftObjectDetails } from '../config/types'

export const buildMessageFileDraftObjectDetails = (file: File) => ({
  contentType: file.type,
  size: file.size
})

const loadImageAspectRatioDetails = async (file: File): Promise<MessageMediaDraftObjectDetails<ImageObject>> => {
  const imageUrl = URL.createObjectURL(file)

  try {
    const image = new Image()

    image.src = imageUrl
    await image.decode()

    if (!image.naturalWidth || !image.naturalHeight) return {}

    return {
      aspectRatio: image.naturalWidth / image.naturalHeight
    }
  } catch {
    return {}
  } finally {
    URL.revokeObjectURL(imageUrl)
  }
}

const loadVideoMetadata = (video: HTMLVideoElement) =>
  new Promise<void>((resolve, reject) => {
    const cleanup = () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('error', handleError)
    }
    const handleLoadedMetadata = () => {
      cleanup()
      resolve()
    }
    const handleError = () => {
      cleanup()
      reject(video.error)
    }

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('error', handleError)
  })

const loadVideoAspectRatioDetails = async (file: File): Promise<MessageMediaDraftObjectDetails<VideoObject>> => {
  const videoUrl = URL.createObjectURL(file)

  try {
    const video = document.createElement('video')

    video.preload = 'metadata'
    video.playsInline = true
    video.src = videoUrl
    video.load()

    await loadVideoMetadata(video)

    if (!video.videoWidth || !video.videoHeight) return {}

    return {
      aspectRatio: video.videoWidth / video.videoHeight
    }
  } catch {
    return {}
  } finally {
    URL.revokeObjectURL(videoUrl)
  }
}

export const buildMessageImageDraftObjectDetails = async (file: File) => ({
  ...buildMessageFileDraftObjectDetails(file),
  ...(await loadImageAspectRatioDetails(file))
})

export const buildMessageVideoDraftObjectDetails = async (file: File) => ({
  ...buildMessageFileDraftObjectDetails(file),
  ...(await loadVideoAspectRatioDetails(file))
})

export const buildMessageMediaDraftObject = <Media extends MediaObject>(
  file: File,
  src: string,
  details: MessageMediaDraftObjectDetails<Media>
): Media =>
  ({
    src,
    name: file.name,
    ...details
  } as Media)

export const buildMessageMediaDraftPayloadObject = async <Media extends MediaObject>(
  file: File,
  details: MessageMediaDraftObjectDetails<Media>
): Promise<Media> => ({
  ...buildMessageMediaDraftObject(file, file.name, details),
  fileBuffer: await file.arrayBuffer()
})
