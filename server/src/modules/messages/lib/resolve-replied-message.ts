import { type ImageObject, type RepliedMessage, isString } from 'global-shared'

import { stringifyMongoId } from 'src/shared/lib/normalize-object-id'

import { MessageModel } from '../messages.model'
import type { MessageDocument, ResolveRepliedMessageParams } from '../messages.types'

const normalizeMessageImages = (images: MessageDocument['images'] = []): ImageObject[] => {
  return images.map((image) => (isString(image) ? { src: image, name: image } : image))
}

export const resolveRepliedMessage = async ({
  repliedMessage,
  roomMessageIds,
  userId
}: ResolveRepliedMessageParams): Promise<RepliedMessage | null> => {
  if (!repliedMessage) {
    return null
  }

  const isRoomMessage = roomMessageIds.includes(repliedMessage.id)

  if (!isRoomMessage) {
    return null
  }

  const sourceMessage = await MessageModel.findOne({
    _id: repliedMessage.id,
    deletedForUserIds: { $ne: userId }
  })
    .select('_id authorId authorNickname body images')
    .lean<MessageDocument>()

  if (!sourceMessage) {
    return null
  }

  const { _id, authorId, authorNickname, body, images } = sourceMessage

  return {
    id: stringifyMongoId(_id),
    authorId,
    authorNickname,
    body,
    images: normalizeMessageImages(images),
    ...(repliedMessage.forward && { forward: true })
  }
}
