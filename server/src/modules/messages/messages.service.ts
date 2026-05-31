import {
  type AudioObject,
  type EventAddReaction,
  type EventDeleteMessage,
  type EventEditMessage,
  type EventMessageEdited,
  type EventLoadRoomMessages,
  type EventMessageDeleted,
  type EventMessageDelivered,
  type EventMessagesStatusUpdated,
  type EventPinnedMessageUpdated,
  type EventRoomTypingStatus,
  type EventRoomMessagesLoaded,
  type EventUpdatedMessageReactions,
  type EventUpdatePinnedMessage,
  type EventUpdateMessageStatus,
  type EventUserTyping,
  type DocumentObject,
  type ImageObject,
  type Message,
  type MessageStatus,
  type VideoObject,
  MESSAGE_LOAD_LIMIT_MAX,
  MESSAGE_REACTION_LIMIT_PER_USER,
  MESSAGE_REACTION_UPDATE_ACTION,
  MESSAGE_STATUS_VALUE,
  REQ_STATUS,
  buildPendingMessageLinkPreview,
  getRoomOtherUserIds,
  isMessageAuthor,
  isMessageReadStatus,
  isString
} from 'global-shared'

import { AppError } from 'src/shared/lib/app-error'
import { stringifyMongoId, stringifyMongoIds } from 'src/shared/lib/normalize-object-id'

import { ChatRoomModel } from '../chat-rooms/chat-rooms.model'
import { emitToUsers } from '../presence/presence.utils'
import { UserModel } from '../user/user.model'

import { assertMessageContentLimits } from './lib/assert-message-content-limits'
import { refreshMessageLinkPreview } from './lib/refresh-message-link-preview'
import { resolveRoomMessageWindowIds } from './lib/resolve-message-window-ids'
import { resolveRepliedMessage } from './lib/resolve-replied-message'
import { resolveVisibleMessageIds } from './lib/resolve-visible-message-ids'
import { uploadMessageMediaObjects } from './lib/upload-message-media-objects'
import { MESSAGES_I18N } from './messages.i18n'
import { MessageModel } from './messages.model'
import type { MessageDocument, SendMessageParams } from './messages.types'

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

export const editMessage = async (userId: string, { body, images, messageId, roomId }: EventEditMessage) => {
  const normalizedBody = body.trim()

  if (!normalizedBody) {
    return
  }

  assertMessageContentLimits(normalizedBody, images, [], [], [])

  const room = await ChatRoomModel.findOne({ _id: roomId, users: userId, messages: messageId }).select('users').lean()

  if (!room) {
    return
  }

  const editedAt = Date.now()
  const linkPreview = buildPendingMessageLinkPreview(normalizedBody)
  const imageUpdateConditions = images.map(({ src }) => ({
    $or: [{ images: src }, { images: { $elemMatch: { src } } }]
  }))
  const updateQuery = {
    _id: messageId,
    authorId: userId,
    deletedForUserIds: { $ne: userId }
  }

  if (imageUpdateConditions.length) {
    Object.assign(updateQuery, { $and: imageUpdateConditions })
  }

  const updateResult = await MessageModel.updateOne(updateQuery, {
    $set: {
      body: normalizedBody,
      images,
      linkPreview,
      editedAt
    }
  })

  if (updateResult.modifiedCount <= 0) {
    return
  }

  const payload: EventMessageEdited = {
    roomId,
    messageId,
    body: normalizedBody,
    images,
    linkPreview,
    editedAt
  }

  emitToUsers(stringifyMongoIds(room.users), 'message-edited', payload)
  refreshMessageLinkPreview({
    linkPreview,
    messageId,
    roomId,
    userIds: stringifyMongoIds(room.users)
  })
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
  const visibleMessageIds = await resolveVisibleMessageIds(userId, roomMessageIds)
  const requestedMessageIds = resolveRoomMessageWindowIds(visibleMessageIds, payload)

  if (!requestedMessageIds.length) {
    return {
      roomId: payload.roomId,
      messages: [],
      rangeStartMessageId: null,
      rangeEndMessageId: null
    }
  }

  const messages = await MessageModel.find({
    _id: { $in: requestedMessageIds },
    deletedForUserIds: { $ne: userId }
  })
    .select('-__v')
    .lean<MessageDocument[]>()
  const messageById = new Map(messages.map((message) => [stringifyMongoId(message._id), message]))
  const normalizedMessages = requestedMessageIds.flatMap((messageId) => {
    const message = messageById.get(messageId)

    return message ? [transformMessageForUser(message, userId)] : []
  })
  const rangeStartMessage = normalizedMessages[0]
  const rangeEndMessage = normalizedMessages[normalizedMessages.length - 1]

  return {
    roomId: payload.roomId,
    messages: normalizedMessages,
    rangeStartMessageId: rangeStartMessage?.id ?? null,
    rangeEndMessageId: rangeEndMessage?.id ?? null
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
    deletedForUserIds: { $ne: userId },
    usersMetaData: {
      $elemMatch: {
        id: userId,
        status: MESSAGE_STATUS_VALUE.DELIVERED
      }
    }
  })
    .select('_id')
    .lean<Array<{ _id: string }>>()
  const messageIds = unreadMessages.map(({ _id }) => stringifyMongoId(_id))

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

export const deleteMessage = async (userId: string, { deleteForEveryone, roomId, messageId }: EventDeleteMessage) => {
  const room = await ChatRoomModel.findOne({ _id: roomId, users: userId, messages: messageId }).select('users').lean()

  if (!room) {
    return
  }

  const userIds = stringifyMongoIds(room.users)
  const payload: EventMessageDeleted = {
    roomId,
    messageId
  }

  if (!deleteForEveryone) {
    const updateResult = await MessageModel.updateOne({ _id: messageId }, { $addToSet: { deletedForUserIds: userId } })

    if (updateResult.modifiedCount <= 0) {
      return
    }

    emitToUsers([userId], 'message-deleted', payload)

    return
  }

  const deletedMessage = await MessageModel.findOneAndDelete({ _id: messageId, authorId: userId }).select('_id').lean()

  if (!deletedMessage) {
    return
  }

  await Promise.all([
    ChatRoomModel.updateOne({ _id: roomId }, { $pull: { messages: messageId } }),
    ChatRoomModel.updateOne({ _id: roomId, pinnedMessageId: messageId }, { $set: { pinnedMessageId: null } })
  ])
  emitToUsers(userIds, 'message-deleted', payload)
}

const resolvePinnedMessageUpdatedPayload = async (
  userId: string,
  roomId: string,
  pinnedMessageId: string | null
): Promise<EventPinnedMessageUpdated> => {
  if (!pinnedMessageId) {
    return {
      roomId,
      pinnedMessageId: null,
      pinnedMessage: null
    }
  }

  const pinnedMessage = await MessageModel.findOne({
    _id: pinnedMessageId,
    deletedForUserIds: { $ne: userId }
  })
    .select('-__v')
    .lean<MessageDocument>()

  return {
    roomId,
    pinnedMessageId: pinnedMessage ? pinnedMessageId : null,
    pinnedMessage: pinnedMessage ? transformMessageForUser(pinnedMessage, userId) : null
  }
}

export const updatePinnedMessage = async (
  userId: string,
  { isPinned, messageId, roomId }: EventUpdatePinnedMessage
) => {
  const room = await ChatRoomModel.findOne({ _id: roomId, users: userId, messages: messageId }).select('users').lean()

  if (!room) {
    return
  }

  if (isPinned) {
    const message = await MessageModel.findOne({ _id: messageId, deletedForUserIds: { $ne: userId } })
      .select('_id')
      .lean()

    if (!message) return
  }

  const pinnedMessageId = isPinned ? messageId : null
  const query = isPinned ? { _id: roomId } : { _id: roomId, pinnedMessageId: messageId }
  const updateResult = await ChatRoomModel.updateOne(query, { $set: { pinnedMessageId } })

  if (updateResult.modifiedCount <= 0) {
    return
  }

  const userIds = stringifyMongoIds(room.users)

  await Promise.all(
    userIds.map(async (targetUserId) => {
      const payload = await resolvePinnedMessageUpdatedPayload(targetUserId, roomId, pinnedMessageId)

      emitToUsers([targetUserId], 'pinned-message-updated', payload)
    })
  )
}

export const toggleMessageReaction = async (userId: string, { glyphKey, messageId, roomId }: EventAddReaction) => {
  const [room, user] = await Promise.all([
    ChatRoomModel.findOne({ _id: roomId, users: userId, messages: messageId }).select('users').lean(),
    UserModel.findById(userId).select('public.nickname').lean()
  ])

  if (!room || !user) return

  const reaction = {
    authorId: userId,
    nickname: user.public.nickname,
    glyphKey
  }
  const removeResult = await MessageModel.updateOne(
    { _id: messageId, deletedForUserIds: { $ne: userId } },
    { $pull: { reactions: { authorId: userId, glyphKey } } }
  )

  if (removeResult.modifiedCount > 0) {
    const payload: EventUpdatedMessageReactions = {
      roomId,
      messageId,
      action: MESSAGE_REACTION_UPDATE_ACTION.REMOVE,
      reaction
    }

    emitToUsers(stringifyMongoIds(room.users), 'message-reaction-updated', payload)

    return
  }

  // Считаем реакции пользователя в Mongo-запросе, чтобы лимит не зависел от локального снимка.
  const userReactionCountExpression = {
    $size: {
      $filter: {
        input: { $ifNull: ['$reactions', []] },
        as: 'reaction',
        cond: { $eq: ['$$reaction.authorId', userId] }
      }
    }
  }
  const addResult = await MessageModel.updateOne(
    {
      _id: messageId,
      deletedForUserIds: { $ne: userId },
      $expr: { $lt: [userReactionCountExpression, MESSAGE_REACTION_LIMIT_PER_USER] }
    },
    { $addToSet: { reactions: reaction } }
  )

  if (addResult.modifiedCount <= 0) return

  const payload: EventUpdatedMessageReactions = {
    roomId,
    messageId,
    action: MESSAGE_REACTION_UPDATE_ACTION.ADD,
    reaction
  }

  emitToUsers(stringifyMongoIds(room.users), 'message-reaction-updated', payload)
}

export const emitRoomTypingStatus = async (userId: string, { roomId, isTyping }: EventUserTyping) => {
  const room = await ChatRoomModel.findOne({ _id: roomId, users: userId }).select('users -_id').lean()

  if (!room) {
    return
  }

  const userIds = stringifyMongoIds(room.users)
  const payload: EventRoomTypingStatus = {
    roomId,
    contactId: userId,
    isTyping
  }

  emitToUsers(getRoomOtherUserIds({ users: userIds }, userId), 'room-typing-status', payload)
}

export const sendMessage = async ({ roomId, userId, message }: SendMessageParams) => {
  const messageImages = message.images ?? []
  const messageDocuments = message.documents ?? []
  const messageAudios = message.audios ?? []
  const messageVideos = message.videos ?? []

  assertMessageContentLimits(message.body, messageImages, messageDocuments, messageAudios, messageVideos)

  const room = await ChatRoomModel.findOne({ _id: roomId, users: userId }).select('users messages').lean()

  if (!room) {
    return
  }

  const repliedMessage = await resolveRepliedMessage({
    repliedMessage: message.repliedMessage,
    roomId,
    roomMessageIds: stringifyMongoIds(room.messages),
    userId
  })
  const [images, documents, audios, videos] = await Promise.all([
    uploadMessageMediaObjects<ImageObject>(messageImages, 'image', {
      compression: message.imageCompression ? 'common-compressed' : 'common-uncompressed'
    }),
    uploadMessageMediaObjects<DocumentObject>(messageDocuments, 'doc'),
    uploadMessageMediaObjects<AudioObject>(messageAudios, 'audio'),
    uploadMessageMediaObjects<VideoObject>(messageVideos, 'video')
  ])
  const linkPreview = buildPendingMessageLinkPreview(message.body)
  const hasMessageBody = Boolean(message.body.trim())
  const hasMessageImages = Boolean(images.length)
  const hasMessageDocuments = Boolean(documents.length)
  const hasMessageAudios = Boolean(audios.length)
  const hasMessageVideos = Boolean(videos.length)
  const hasMessageDraftReference = Boolean(repliedMessage)
  const hasMessageContent =
    hasMessageBody ||
    hasMessageImages ||
    hasMessageDocuments ||
    hasMessageAudios ||
    hasMessageVideos ||
    hasMessageDraftReference

  if (!hasMessageContent) {
    return
  }

  const newDbMessage = await new MessageModel({
    _id: message.id,
    ...message,
    reactions: [],
    images,
    documents,
    audios,
    videos,
    linkPreview,
    usersMetaData: [],
    repliedMessage
  }).save()
  const { users } = room

  await ChatRoomModel.updateOne({ _id: roomId, users: userId }, { $push: { messages: newDbMessage.id } })

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
          documents,
          audios,
          videos,
          linkPreview,
          repliedMessage,
          isSelf: isMessageAuthor(message, stringifyMongoId(user._id)),
          status: MESSAGE_STATUS_VALUE.DELIVERED
        }
      }

      emitToUsers([user._id], 'message-delivered', payload)
    })
  )
  refreshMessageLinkPreview({
    linkPreview,
    messageId: newDbMessage.id,
    roomId,
    userIds: stringifyMongoIds(users)
  })
}
