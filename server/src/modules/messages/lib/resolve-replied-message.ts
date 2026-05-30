import { type ImageObject, type RepliedMessage, isString } from 'global-shared'

import { stringifyMongoId } from 'src/shared/lib/normalize-object-id'

import { ChatRoomModel } from '../../chat-rooms/chat-rooms.model'
import { MessageModel } from '../messages.model'
import type { MessageDocument, ResolveRepliedMessageParams } from '../messages.types'

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
    const sourceRoom = await ChatRoomModel.findOne({ users: userId, messages: repliedMessage.id }).select('_id').lean()

    if (!sourceRoom) {
      return null
    }

    sourceRoomId = stringifyMongoId(sourceRoom._id)
  }

  const sourceMessage = await MessageModel.findOne({
    _id: repliedMessage.id,
    deletedForUserIds: { $ne: userId }
  })
    .select('_id authorId authorNickname body images documents')
    .lean<MessageDocument>()

  if (!sourceMessage) {
    return null
  }

  const { _id, authorId, authorNickname, body, images, documents } = sourceMessage

  return {
    id: stringifyMongoId(_id),
    roomId: sourceRoomId,
    authorId,
    authorNickname,
    body,
    images: normalizeMessageImages(images),
    ...(documents && { documents }),
    ...(repliedMessage.forward && { forward: true })
  }
}
