import { type ImageObject, type RepliedMessage, isString } from 'global-shared'

import { stringifyMongoId } from 'src/shared/lib/normalize-object-id'

import { findSourceRoomByMessageForUser } from '../../chat-rooms/lib/chat-room-persistence'
import { MessageModel } from '../messages.model'
import type { MessageDocument, RepliedMessageSourceProjection, ResolveRepliedMessageParams } from '../messages.types'

const normalizeMessageImages = (images: MessageDocument['images'] = []): ImageObject[] => {
  return images.map((image) => (isString(image) ? { src: image, name: image } : image))
}

export const resolveRepliedMessage = async ({
  repliedMessage,
  roomId,
  roomMessageIds,
  userId
}: ResolveRepliedMessageParams): Promise<RepliedMessage | null> => {
  if (!repliedMessage) {
    return null
  }

  const isRoomMessage = roomMessageIds.includes(repliedMessage.id)
  const isForwardMessage = Boolean(repliedMessage.forward)

  if (!isRoomMessage && !isForwardMessage) {
    return null
  }

  let sourceRoomId = roomId

  if (isForwardMessage && !isRoomMessage) {
    const sourceRoom = await findSourceRoomByMessageForUser(userId, repliedMessage.id)

    if (!sourceRoom) {
      return null
    }

    sourceRoomId = stringifyMongoId(sourceRoom._id)
  }

  const sourceMessage = await MessageModel.findOne({
    _id: repliedMessage.id,
    deletedForUserIds: { $ne: userId }
  })
    .select('_id authorId authorKind authorNickname body images documents audios videos')
    .lean<RepliedMessageSourceProjection>()

  if (!sourceMessage) {
    return null
  }

  const { _id, authorId, authorKind, authorNickname, body, images, documents, audios, videos } = sourceMessage

  return {
    id: stringifyMongoId(_id),
    roomId: sourceRoomId,
    authorId,
    authorNickname,
    ...(authorKind && { authorKind }),
    body,
    images: normalizeMessageImages(images),
    ...(documents && { documents }),
    ...(audios && { audios }),
    ...(videos && { videos }),
    ...(repliedMessage.forward && { forward: true })
  }
}
