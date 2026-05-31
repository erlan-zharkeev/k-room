import type { RepliedMessage } from 'global-shared'

import type { MessageRecord } from 'src/shared/lib'

import { MESSAGE_DRAFT_REFERENCE_KIND } from '../config/constants'
import type { MessageDraftReferenceKind } from '../config/types'

import { cloneMediaObjects } from './clone-media-objects'

export const cloneRepliedMessage = (message: RepliedMessage): RepliedMessage => ({
  ...message,
  ...(message.images && { images: cloneMediaObjects(message.images) }),
  ...(message.documents && { documents: cloneMediaObjects(message.documents) }),
  ...(message.audios && { audios: cloneMediaObjects(message.audios) })
})

export const buildRepliedMessage = (
  message: MessageRecord,
  kind: MessageDraftReferenceKind,
  roomId: string
): RepliedMessage => {
  const { id, audios, authorId, authorNickname, body, documents, images } = message

  return {
    id,
    roomId,
    authorId,
    authorNickname,
    body,
    ...(images && { images: cloneMediaObjects(images) }),
    ...(documents && { documents: cloneMediaObjects(documents) }),
    ...(audios && { audios: cloneMediaObjects(audios) }),
    ...(kind === MESSAGE_DRAFT_REFERENCE_KIND.FORWARD && { forward: true })
  }
}
