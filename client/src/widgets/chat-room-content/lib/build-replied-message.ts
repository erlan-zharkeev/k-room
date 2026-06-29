import type { Message, RepliedMessage } from 'global-shared'

import type { MessageDraftReferenceKind } from '../config/types'

import { cloneMediaObjects } from './clone-media-objects'

export const cloneRepliedMessage = (message: RepliedMessage): RepliedMessage => ({
  ...message,
  ...(message.images && { images: cloneMediaObjects(message.images) }),
  ...(message.documents && { documents: cloneMediaObjects(message.documents) }),
  ...(message.audios && { audios: cloneMediaObjects(message.audios) }),
  ...(message.videos && { videos: cloneMediaObjects(message.videos) })
})

export const buildRepliedMessage = (
  message: Message,
  kind: MessageDraftReferenceKind,
  roomId: string
): RepliedMessage => {
  const { id, audios, authorId, authorKind, authorNickname, body, documents, images, videos } = message

  return {
    id,
    roomId,
    authorId,
    authorNickname,
    ...(authorKind && { authorKind }),
    body,
    ...(images && { images: cloneMediaObjects(images) }),
    ...(documents && { documents: cloneMediaObjects(documents) }),
    ...(audios && { audios: cloneMediaObjects(audios) }),
    ...(videos && { videos: cloneMediaObjects(videos) }),
    ...(kind === 'forward' && { forward: true })
  }
}
