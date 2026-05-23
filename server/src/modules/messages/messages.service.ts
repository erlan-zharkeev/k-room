import {
  type MessageDocument,
  type EventLoadRoomMessages,
  type EventMessageDelivered,
  type EventMessagesStatusUpdated,
  type EventRoomMessagesLoaded,
  type EventUpdateMessageStatus,
  type ImageObject,
  type Message,
  type MessageStatus,
  MESSAGE_BODY_MAX_LENGTH,
  MESSAGE_IMAGE_LIMIT,
  MESSAGE_LOAD_LIMIT_MAX,
  MESSAGE_STATUS_VALUE,
  MEDIA_IMAGE_FILENAME_PREFIX,
  REQ_STATUS,
  isMessageAuthor,
  isMessageReadStatus,
  isString
} from 'global-shared'
import { v4 as uuidv4 } from 'uuid'

import { AppError } from 'src/shared/lib/app-error'

import { ChatRoomModel } from '../chat-rooms/chat-rooms.model'
import { uploadBufferToBucket } from '../media/media.service'
import { emitToUsers } from '../presence/presence.utils'
import { UserModel } from '../user/user.model'

import { MESSAGES_I18N } from './messages.i18n'
import { MessageModel } from './messages.model'
import type { SendMessageParams } from './messages.types'

export const transformMessageForUser = (message: MessageDocument, userId: string): Message => {
  const readBySomeone = message.usersMetaData.some((data) => isMessageReadStatus(data.status))
  const selfStatus = message.usersMetaData.find((user) => user.id === userId)?.status
  const status = isMessageAuthor(message, userId) && readBySomeone ? MESSAGE_STATUS_VALUE.READ : selfStatus
  const images = (message.images ?? []) as Array<string | ImageObject>

  return {
    id: String(message._id),
    authorId: message.authorId,
    authorNickname: message.authorNickname,
    body: message.body,
    createdAt: message.createdAt,
    reactions: message.reactions,
    images: images.map((image) => (isString(image) ? { src: image, name: image } : image)),
    status,
    isSelf: isMessageAuthor(message, userId),
    repliedMessage: message.repliedMessage
  }
}

export const loadRoomMessages = async (
  userId: string,
  payload: EventLoadRoomMessages
): Promise<EventRoomMessagesLoaded | null> => {
  if (payload.limit > MESSAGE_LOAD_LIMIT_MAX) {
    throw new AppError(REQ_STATUS.badRequest, MESSAGES_I18N.messageLoadLimitExceeded)
  }

  const room = await ChatRoomModel.findOne({ _id: payload.roomId, users: userId }).select('messages').lean()

  if (!room) {
    return null
  }

  const query = payload.beforeCreatedAt
    ? { _id: { $in: room.messages }, createdAt: { $lt: payload.beforeCreatedAt } }
    : { _id: { $in: room.messages } }

  const messages = await MessageModel.find(query)
    .sort({ createdAt: -1 })
    .limit(payload.limit + 1)
    .select('-__v')
    .lean<MessageDocument[]>()
  const hasMore = messages.length > payload.limit
  const page = hasMore ? messages.slice(0, payload.limit) : messages
  const normalizedMessages = page.reverse().map((message) => transformMessageForUser(message, userId))

  return {
    roomId: payload.roomId,
    messages: normalizedMessages,
    hasMore,
    nextBeforeCreatedAt: normalizedMessages[0]?.createdAt
  }
}

export const changeMessageStatus = async (messageId: string, status: MessageStatus, userId: string, roomId: string) => {
  if (!isMessageReadStatus(status)) {
    return
  }

  const room = await ChatRoomModel.findOne({ _id: roomId, users: userId, messages: messageId }).select('users').lean()

  if (!room) {
    return
  }

  const message = await MessageModel.findOneAndUpdate(
    {
      _id: messageId,
      authorId: { $ne: userId },
      usersMetaData: {
        $elemMatch: {
          id: userId,
          status: MESSAGE_STATUS_VALUE.DELIVERED
        }
      }
    },
    { $set: { 'usersMetaData.$.status': status } }
  )

  if (!message) {
    return
  }

  const payload: EventUpdateMessageStatus = {
    roomId,
    messageId,
    status,
    userId
  }

  emitToUsers(room.users, 'message-status-updated', payload)
}

export const markRoomAsRead = async (roomId: string, userId: string) => {
  const room = await ChatRoomModel.findOne({ _id: roomId, users: userId }).select('users messages').lean()

  if (!room) {
    return
  }

  if (!room.messages.length) {
    return
  }

  const unreadMessages = await MessageModel.find({
    _id: { $in: room.messages },
    authorId: { $ne: userId },
    usersMetaData: {
      $elemMatch: {
        id: userId,
        status: MESSAGE_STATUS_VALUE.DELIVERED
      }
    }
  })
    .select('_id')
    .lean<Array<{ _id: string }>>()
  const messageIds = unreadMessages.map(({ _id }) => String(_id))

  if (!messageIds.length) {
    return
  }

  const updateResult = await MessageModel.updateMany(
    {
      _id: { $in: messageIds },
      'usersMetaData.id': userId
    },
    {
      $set: {
        'usersMetaData.$.status': MESSAGE_STATUS_VALUE.READ
      }
    }
  )

  if (updateResult.modifiedCount <= 0) {
    return
  }

  const payload: EventMessagesStatusUpdated = {
    roomId,
    messageIds,
    status: MESSAGE_STATUS_VALUE.READ,
    userId,
    updatedMessagesQuantity: updateResult.modifiedCount
  }

  emitToUsers(room.users, 'messages-status-updated', payload)
}

export const sendMessage = async ({ roomId, message }: SendMessageParams) => {
  if (message.body.length > MESSAGE_BODY_MAX_LENGTH) {
    throw new AppError(REQ_STATUS.badRequest, MESSAGES_I18N.messageBodyTooLong)
  }

  if ((message.images ?? []).length > MESSAGE_IMAGE_LIMIT) {
    throw new AppError(REQ_STATUS.badRequest, MESSAGES_I18N.messageImageLimitReached)
  }

  const filenames: string[] = []

  await Promise.all(
    (message.images ?? []).map(async (image) => {
      if (!image.fileBuffer) {
        return
      }

      const filename = `${MEDIA_IMAGE_FILENAME_PREFIX}${uuidv4()}`

      filenames.push(filename)
      await uploadBufferToBucket(image.fileBuffer, filename, 'image', {
        compression: message.imageCompression ? 'common-compressed' : 'common-uncompressed'
      })
    })
  )

  const newDbMessage = await new MessageModel({
    _id: message.id,
    ...message,
    reactions: [],
    images: filenames,
    usersMetaData: []
  }).save()
  const room = await ChatRoomModel.findOneAndUpdate({ _id: roomId }, { $push: { messages: newDbMessage.id } })

  if (!room) {
    return
  }

  await Promise.all(
    room.users.map(async (userId) => {
      await MessageModel.updateOne(
        { _id: newDbMessage.id },
        { $push: { usersMetaData: { id: userId, status: MESSAGE_STATUS_VALUE.DELIVERED } } }
      )

      const user = await UserModel.findById(userId).lean()

      if (!user) {
        return
      }

      const payload: EventMessageDelivered = {
        roomId,
        message: {
          ...message,
          id: newDbMessage.id,
          images: filenames.map((filename) => ({ src: filename, name: filename })),
          isSelf: isMessageAuthor(message, String(user._id)),
          status: MESSAGE_STATUS_VALUE.DELIVERED
        }
      }

      emitToUsers([user._id], 'message-delivered', payload)
    })
  )
}
