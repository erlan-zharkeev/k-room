import type { ImageObject, MediaObject } from 'global-shared'

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

export const buildMessageImageDraftObjectDetails = async (file: File) => ({
  ...buildMessageFileDraftObjectDetails(file),
  ...(await loadImageAspectRatioDetails(file))
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
