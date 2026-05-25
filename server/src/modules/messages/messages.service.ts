import {
  type MessageDocument,
  type EventLoadRoomMessages,
  type EventMessageDelivered,
  type EventMessagesStatusUpdated,
  type EventRoomTypingStatus,
  type EventRoomMessagesLoaded,
  type EventUpdateMessageStatus,
  type EventUserTyping,
  type ImageObject,
  type Message,
  type MessageStatus,
  MESSAGE_BODY_MAX_LENGTH,
  MESSAGE_IMAGE_LIMIT,
  MESSAGE_LOAD_LIMIT_MAX,
  MESSAGE_STATUS_VALUE,
  REQ_STATUS,
  getRoomOtherUserIds,
  isMessageAuthor,
  isMessageReadStatus,
  isString
} from 'global-shared'

import { AppError } from 'src/shared/lib/app-error'

import { ChatRoomModel } from '../chat-rooms/chat-rooms.model'
import { uploadBufferToBucket } from '../media/media.service'
import { emitToUsers } from '../presence/presence.utils'
import { UserModel } from '../user/user.model'

import { MESSAGES_I18N } from './messages.i18n'
import { MessageModel } from './messages.model'
import type { SendMessageParams } from './messages.types'

export const transformMessageForUser = (message: MessageDocument, userId: string): Message => {
  const { _id, authorId, authorNickname, body, createdAt, reactions, repliedMessage, usersMetaData } = message
  const readBySomeone = usersMetaData.some((data) => isMessageReadStatus(data.status))
  const selfStatus = usersMetaData.find((user) => user.id === userId)?.status
  const status = isMessageAuthor(message, userId) && readBySomeone ? MESSAGE_STATUS_VALUE.READ : selfStatus
  const images = (message.images ?? []) as Array<string | ImageObject>

  return {
    id: String(_id),
    authorId,
    authorNickname,
    body,
    createdAt,
    reactions,
    images: images.map((image) => (isString(image) ? { src: image, name: image } : image)),
    status,
    isSelf: isMessageAuthor(message, userId),
    repliedMessage
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

  const { messages: roomMessageIds } = room
  const query = payload.beforeCreatedAt
    ? { _id: { $in: roomMessageIds }, createdAt: { $lt: payload.beforeCreatedAt } }
    : { _id: { $in: roomMessageIds } }

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

  const { users } = room
  const payload: EventUpdateMessageStatus = {
    roomId,
    messageId,
    status,
    userId
  }

  emitToUsers(users, 'message-status-updated', payload)
}

export const markRoomAsRead = async (roomId: string, userId: string) => {
  const room = await ChatRoomModel.findOne({ _id: roomId, users: userId }).select('users messages').lean()

  if (!room) {
    return
  }

  const { users, messages } = room

  if (!messages.length) {
    return
  }

  const unreadMessages = await MessageModel.find({
    _id: { $in: messages },
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

  emitToUsers(users, 'messages-status-updated', payload)
}

export const emitRoomTypingStatus = async (userId: string, { roomId, isTyping }: EventUserTyping) => {
  const room = await ChatRoomModel.findOne({ _id: roomId, users: userId }).select('users -_id').lean()

  if (!room) {
    return
  }

  const userIds = room.users.map(String)
  const payload: EventRoomTypingStatus = {
    roomId,
    contactId: userId,
    isTyping
  }

  emitToUsers(getRoomOtherUserIds({ users: userIds }, userId), 'room-typing-status', payload)
}

export const sendMessage = async ({ roomId, message }: SendMessageParams) => {
  if (message.body.length > MESSAGE_BODY_MAX_LENGTH) {
    throw new AppError(REQ_STATUS.badRequest, MESSAGES_I18N.messageBodyTooLong)
  }

  if ((message.images ?? []).length > MESSAGE_IMAGE_LIMIT) {
    throw new AppError(REQ_STATUS.badRequest, MESSAGES_I18N.messageImageLimitReached)
  }

  const uploadedImages = await Promise.all(
    (message.images ?? []).map(async (image) => {
      if (!image.fileBuffer) {
        return null
      }

      const src = await uploadBufferToBucket(image.fileBuffer, 'image', {
        compression: message.imageCompression ? 'common-compressed' : 'common-uncompressed'
      })

      return {
        src,
        name: image.name || src
      } satisfies ImageObject
    })
  )
  const images = uploadedImages.filter((image): image is ImageObject => Boolean(image))

  const newDbMessage = await new MessageModel({
    _id: message.id,
    ...message,
    reactions: [],
    images,
    usersMetaData: []
  }).save()
  const room = await ChatRoomModel.findOneAndUpdate({ _id: roomId }, { $push: { messages: newDbMessage.id } })

  if (!room) {
    return
  }

  const { users } = room

  await Promise.all(
    users.map(async (userId) => {
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
          images,
          isSelf: isMessageAuthor(message, String(user._id)),
          status: MESSAGE_STATUS_VALUE.DELIVERED
        }
      }

      emitToUsers([user._id], 'message-delivered', payload)
    })
  )
}
