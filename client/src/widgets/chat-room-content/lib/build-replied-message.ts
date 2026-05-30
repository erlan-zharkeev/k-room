import type { RepliedMessage } from 'global-shared'

import type { MessageRecord } from 'src/shared/lib'

import { MESSAGE_DRAFT_REFERENCE_KIND } from '../config/constants'
import type { MessageDraftReferenceKind } from '../config/types'

export const cloneRepliedMessage = (message: RepliedMessage): RepliedMessage => ({
  ...message,
  ...(message.images && { images: message.images.map((image) => ({ ...image })) })
})

export const buildRepliedMessage = (
  message: MessageRecord,
  kind: MessageDraftReferenceKind,
  roomId: string
): RepliedMessage => {
  const { id, authorId, authorNickname, body, images } = message

  return {
    id,
    roomId,
    authorId,
    authorNickname,
    body,
    ...(images && { images: images.map((image) => ({ ...image })) }),
    ...(kind === MESSAGE_DRAFT_REFERENCE_KIND.FORWARD && { forward: true })
  }
}
