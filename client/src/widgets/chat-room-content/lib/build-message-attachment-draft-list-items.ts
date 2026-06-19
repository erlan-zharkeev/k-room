import type { AudioObject, DocumentObject, ImageObject, VideoObject } from 'global-shared'

import type {
  MessageAttachmentDraftListFileItem,
  MessageAttachmentDraftListFileKind,
  MessageAttachmentDraftListImageItem,
  MessageAttachmentDraftListItem
} from '../config/types'

const buildMessageImageAttachmentDraftListItems = (images: ImageObject[]): MessageAttachmentDraftListImageItem[] =>
  images.map(({ name, src }) => ({
    kind: 'image',
    name,
    src
  }))

const buildMessageFileAttachmentDraftListItems = (
  kind: MessageAttachmentDraftListFileKind,
  mediaObjects: (DocumentObject | AudioObject | VideoObject)[]
): MessageAttachmentDraftListFileItem[] =>
  mediaObjects.map(({ contentType, name, size, src }) => ({
    kind,
    name,
    src,
    contentType,
    size
  }))

export const buildMessageAttachmentDraftListItems = (
  images: ImageObject[],
  documents: DocumentObject[],
  audios: AudioObject[],
  videos: VideoObject[]
): MessageAttachmentDraftListItem[] => [
  ...buildMessageImageAttachmentDraftListItems(images),
  ...buildMessageFileAttachmentDraftListItems('document', documents),
  ...buildMessageFileAttachmentDraftListItems('audio', audios),
  ...buildMessageFileAttachmentDraftListItems('video', videos)
]
