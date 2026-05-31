import type { AudioObject, DocumentObject, ImageObject } from 'global-shared'

import { MESSAGE_ATTACHMENT_DRAFT_KIND } from '../config/constants'
import type {
  MessageAttachmentDraftFileMediaObject,
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
  mediaObjects: MessageAttachmentDraftFileMediaObject[]
): MessageAttachmentDraftListFileItem[] =>
  mediaObjects.map(({ contentType, name, previewSrc, size, src }) => ({
    kind,
    name,
    src,
    contentType,
    previewSrc,
    size
  }))

export const buildMessageAttachmentDraftListItems = (
  images: ImageObject[],
  documents: DocumentObject[],
  audios: AudioObject[]
): MessageAttachmentDraftListItem[] => [
  ...buildMessageImageAttachmentDraftListItems(images),
  ...buildMessageFileAttachmentDraftListItems(MESSAGE_ATTACHMENT_DRAFT_KIND.DOCUMENT, documents),
  ...buildMessageFileAttachmentDraftListItems(MESSAGE_ATTACHMENT_DRAFT_KIND.AUDIO, audios)
]
