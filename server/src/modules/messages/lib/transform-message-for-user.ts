import {
  type ImageObject,
  type Message,
  MESSAGE_STATUS_VALUE,
  isMessageAuthor,
  isMessageReadStatus,
  isString
} from 'global-shared'

import { stringifyMongoId } from 'src/shared/lib/normalize-object-id'

import type { MessageDocument } from '../messages.types'

export const transformMessageForUser = (message: MessageDocument, userId: string): Message => {
  const {
    _id,
    authorId,
    authorNickname,
    body,
    createdAt,
    editedAt,
    reactions,
    repliedMessage,
    linkPreview,
    documents,
    audios,
    videos,
    usersMetaData
  } = message
  const readBySomeone = usersMetaData.some((data) => isMessageReadStatus(data.status))
  const selfStatus = usersMetaData.find((user) => user.id === userId)?.status
  const status = isMessageAuthor(message, userId) && readBySomeone ? MESSAGE_STATUS_VALUE.READ : selfStatus
  const images = (message.images ?? []) as Array<string | ImageObject>

  return {
    id: stringifyMongoId(_id),
    authorId,
    authorNickname,
    body,
    createdAt,
    editedAt,
    reactions,
    images: images.map((image) => (isString(image) ? { src: image, name: image } : image)),
    documents,
    audios,
    videos,
    linkPreview,
    status,
    isSelf: isMessageAuthor(message, userId),
    repliedMessage
  }
}
