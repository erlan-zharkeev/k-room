import type { MediaObject } from 'global-shared'

import type { MessageMediaDraftObjectDetails } from '../config/types'

export const buildMessageFileDraftObjectDetails = (file: File) => ({
  contentType: file.type,
  size: file.size
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
  }) as Media

export const buildMessageMediaDraftPayloadObject = async <Media extends MediaObject>(
  file: File,
  details: MessageMediaDraftObjectDetails<Media>
): Promise<Media> => ({
  ...buildMessageMediaDraftObject(file, file.name, details),
  fileBuffer: await file.arrayBuffer()
})
