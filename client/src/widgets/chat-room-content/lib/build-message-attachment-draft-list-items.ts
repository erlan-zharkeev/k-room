import type { AudioObject, DocumentObject, ImageObject, VideoObject } from 'global-shared'

import { MESSAGE_ATTACHMENT_DRAFT_KIND } from '../config/constants'
import type {
  MessageAttachmentDraftListFileItem,
  MessageAttachmentDraftListFileKind,
  MessageAttachmentDraftListImageItem,
  MessageAttachmentDraftListItem
} from '../config/types'

const buildMessageImageAttachmentDraftListItems = (images: ImageObject[]): MessageAttachmentDraftListImageItem[] =>
  images.map(({ name, src }) => ({
    kind: MESSAGE_ATTACHMENT_DRAFT_KIND.IMAGE,
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
  ...buildMessageFileAttachmentDraftListItems(MESSAGE_ATTACHMENT_DRAFT_KIND.DOCUMENT, documents),
  ...buildMessageFileAttachmentDraftListItems(MESSAGE_ATTACHMENT_DRAFT_KIND.AUDIO, audios),
  ...buildMessageFileAttachmentDraftListItems(MESSAGE_ATTACHMENT_DRAFT_KIND.VIDEO, videos)
]
