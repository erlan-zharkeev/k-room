import {
  type IDBMessage,
  type IEventLoadRoomMessages,
  type IEventMessageDelivered,
  type IEventMessagesStatusUpdated,
  type IEventRoomMessagesLoaded,
  type IEventUpdateMessageStatus,
  type IImageObject,
  type IMessage,
  type MessageStatusType,
  MEDIA_IMAGE_FILENAME_PREFIX
} from 'global-shared'
import { isString } from 'lodash'
import { v4 as uuidv4 } from 'uuid'

import { ChatRoomModel } from '../chat-rooms/chat-rooms.model'
import { uploadBufferToBucket } from '../media/media.service'
import { emitToUsers } from '../presence/presence.utils'
import { UserModel } from '../user/user.model'

import { MessageModel } from './messages.model'
import type { ISendMessageParams } from './messages.types'

export const transformMessageForUser = (message: IDBMessage, userId: string): IMessage => {
  const readBySomeone = message.usersMetaData.some((data) => data.status === 'read')
  const selfStatus = message.usersMetaData.find((user) => user.id === userId)?.status
  const status = message.authorId === userId ? (readBySomeone ? 'read' : selfStatus) : selfStatus
  const images = (message.images ?? []) as Array<string | IImageObject>

  return {
    id: String(message._id),
    authorId: message.authorId,
    authorNickname: message.authorNickname,
    body: message.body,
    createdAt: message.createdAt,
    reactions: message.reactions,
    images: images.map((image) => (isString(image) ? { src: image, name: image } : image)),
    status,
    isSelf: message.authorId === userId,
    repliedMessage: message.repliedMessage
  }
}

export const loadRoomMessages = async (
  userId: string,
  payload: IEventLoadRoomMessages
): Promise<IEventRoomMessagesLoaded | null> => {
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
    .lean<IDBMessage[]>()
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

export const changeMessageStatus = async (
  messageId: string,
  status: MessageStatusType,
  userId: string,
  roomId: string
) => {
  if (status !== 'read') {
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
          status: 'delivered'
        }
      }
    },
    { $set: { 'usersMetaData.$.status': status } }
  )

  if (!message) {
    return
  }

  const payload: IEventUpdateMessageStatus = {
    roomId,
    messageId,
    status,
    userId
  }

  emitToUsers(room.users, 'message-status-updated', payload)
}

export const markRoomAsRead = async (roomId: string, userId: string) => {
  const room = await ChatRoomModel.findOne({ _id: roomId, users: userId }).select('users messages').lean()

  if (!room?.messages.length) {
    return
  }

  const unreadMessages = await MessageModel.find({
    _id: { $in: room.messages },
    authorId: { $ne: userId },
    usersMetaData: {
      $elemMatch: {
        id: userId,
        status: 'delivered'
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
        'usersMetaData.$.status': 'read'
      }
    }
  )

  if (updateResult.modifiedCount <= 0) {
    return
  }

  const payload: IEventMessagesStatusUpdated = {
    roomId,
    messageIds,
    status: 'read',
    userId,
    updatedMessagesQuantity: updateResult.modifiedCount
  }

  emitToUsers(room.users, 'messages-status-updated', payload)
}

export const sendMessage = async ({ roomId, message }: ISendMessageParams) => {
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

  await Promise.all(
    (room?.users ?? []).map(async (userId) => {
      await MessageModel.updateOne(
        { _id: newDbMessage.id },
        { $push: { usersMetaData: { id: userId, status: 'delivered' } } }
      )

      const user = await UserModel.findById(userId).lean()

      if (!user) {
        return
      }

      const payload: IEventMessageDelivered = {
        roomId,
        message: {
          ...message,
          id: newDbMessage.id,
          images: filenames.map((filename) => ({ src: filename, name: filename })),
          isSelf: String(user._id) === message.authorId,
          status: 'delivered'
        }
      }

      emitToUsers([user._id], 'message-delivered', payload)
    })
  )
}
