import type { DocumentObject, ImageObject } from 'global-shared'

import { MESSAGE_ATTACHMENT_DRAFT_KIND } from '../config/constants'
import type { MessageAttachmentDraftListItem } from '../config/types'

export const buildMessageAttachmentDraftListItems = (
  images: ImageObject[],
  documents: DocumentObject[]
): MessageAttachmentDraftListItem[] => [
  ...images.map(({ name, src }) => ({
    kind: MESSAGE_ATTACHMENT_DRAFT_KIND.IMAGE,
    name,
    src
  })),
  ...documents.map(({ contentType, name, size, src }) => ({
    kind: MESSAGE_ATTACHMENT_DRAFT_KIND.DOCUMENT,
    name,
    src,
    contentType,
    size
  }))
]
