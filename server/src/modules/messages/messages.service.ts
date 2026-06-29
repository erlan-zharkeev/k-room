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
  type UserRole,
  MESSAGE_LOAD_LIMIT_MAX,
  MESSAGE_REACTION_LIMIT_PER_USER,
  REQ_STATUS,
  buildPendingMessageLinkPreview,
  getRoomOtherUserIds,
  isMessageAuthor,
  isMessageReadStatus,
  isRoomFavorites,
  isRoomSupport
} from 'global-shared'

import { SERVER_ENV } from 'src/app/env'
import type { PresenceService } from 'src/modules/presence/presence.service'
import { AppError } from 'src/shared/lib/app-error'
import { stringifyMongoId, stringifyMongoIds } from 'src/shared/lib/normalize-object-id'

import type { ChatRoomUsersMessagesProjection } from '../chat-rooms/chat-rooms.types'
import {
  addMessageToRoom,
  clearPinnedMessageFromRoom,
  findRoomMessagesByUser,
  findRoomUsersAndMessagesByUser,
  findRoomUsersByMessage,
  findRoomUsersByUser,
  removeMessageFromRoom,
  updateSupportChatRoomStatus,
  updateRoomPinnedMessage
} from '../chat-rooms/lib/chat-room-persistence'
import { emitRoomDataToUsers } from '../chat-rooms/lib/emit-room-data-to-users'
import { loadRoomRecipientIds } from '../chat-rooms/lib/support-chat-room-recipients'
import { emitToUsers } from '../presence/presence.utils'
import {
  loadUserPublicNicknameAndRoleById,
  loadUserPublicNicknameById,
  loadUserRoleById
} from '../user/lib/user-persistence'

import { assertMessageContentLimits } from './lib/assert-message-content-limits'
import { refreshMessageLinkPreview } from './lib/refresh-message-link-preview'
import { resolveRoomMessageWindowIds } from './lib/resolve-message-window-ids'
import { resolvePinnedMessageUpdatedPayload } from './lib/resolve-pinned-message-updated-payload'
import { resolveRepliedMessage } from './lib/resolve-replied-message'
import { resolveVisibleMessageIds } from './lib/resolve-visible-message-ids'
import { transformMessageForUser } from './lib/transform-message-for-user'
import { uploadMessageMediaObjects } from './lib/upload-message-media-objects'
import { MESSAGES_I18N } from './messages.i18n'
import { MessageModel } from './messages.model'
import type { MessageDocument, MessageIdProjection, SendMessageParams } from './messages.types'

const canSendMessageToRoom = (room: ChatRoomUsersMessagesProjection | null, userId: string, userRole: UserRole) => {
  if (!room) {
    return false
  }

  if (isRoomSupport(room)) {
    return userRole === 'admin' || room.supportOwnerId === userId
  }

  if (!isRoomFavorites(room)) {
    return true
  }

  const roomUserIds = stringifyMongoIds(room.users)
  const [roomUserId] = roomUserIds

  return room.adminId === userId && roomUserIds.length === 1 && roomUserId === userId
}

const isSupportAgentMessage = (room: ChatRoomUsersMessagesProjection, authorRole: UserRole) =>
  isRoomSupport(room) && authorRole === 'admin'

const reopenSupportChatIfNeeded = async (
  roomId: string,
  room: ChatRoomUsersMessagesProjection,
  presenceService?: PresenceService
) => {
  if (!presenceService || !isRoomSupport(room) || room.supportStatus !== 'closed') {
    return
  }

  const updatedRoom = await updateSupportChatRoomStatus(roomId, 'open')

  if (!updatedRoom) {
    return
  }

  const recipientIds = await loadRoomRecipientIds(updatedRoom)

  await emitRoomDataToUsers(recipientIds, updatedRoom, presenceService)
}

export const editMessage = async (userId: string, { body, images, messageId, roomId }: EventEditMessage) => {
  const normalizedBody = body.trim()

  if (!normalizedBody) {
    return
  }

  assertMessageContentLimits(normalizedBody, images, [], [], [])

  const room = await findRoomUsersByMessage(roomId, userId, messageId)

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
    appName: SERVER_ENV.info.appName,
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

  const user = await loadUserRoleById(userId)

  if (!user) {
    return null
  }

  const room = await findRoomMessagesByUser(payload.roomId, userId, user.system.role)

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

  const user = await loadUserRoleById(userId)

  if (!user) {
    return
  }

  const room = await findRoomUsersByMessage(roomId, userId, messageId, user.system.role)

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

  const recipientIds = await loadRoomRecipientIds(room)
  const payload: EventUpdateMessageStatus = {
    roomId,
    messageId,
    status,
    userId
  }

  emitToUsers(recipientIds, 'message-status-updated', payload)
}

export const markRoomAsRead = async (roomId: string, userId: string) => {
  const user = await loadUserRoleById(userId)

  if (!user) {
    return
  }

  const room = await findRoomUsersAndMessagesByUser(roomId, userId, user.system.role)

  if (!room) {
    return
  }

  const { messages } = room

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
        status: 'delivered'
      }
    }
  })
    .select('_id')
    .lean<MessageIdProjection[]>()
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
        'usersMetaData.$.status': 'read'
      }
    }
  )

  if (updateResult.modifiedCount <= 0) {
    return
  }

  const payload: EventMessagesStatusUpdated = {
    roomId,
    messageIds,
    status: 'read',
    userId,
    updatedMessagesQuantity: updateResult.modifiedCount
  }

  const recipientIds = await loadRoomRecipientIds(room)

  emitToUsers(recipientIds, 'messages-status-updated', payload)
}

export const deleteMessage = async (userId: string, { deleteForEveryone, roomId, messageId }: EventDeleteMessage) => {
  const room = await findRoomUsersByMessage(roomId, userId, messageId)

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

  const deletedMessage = await MessageModel.findOneAndDelete({ _id: messageId, authorId: userId })
    .select('_id')
    .lean<MessageIdProjection>()

  if (!deletedMessage) {
    return
  }

  await Promise.all([removeMessageFromRoom(roomId, messageId), clearPinnedMessageFromRoom(roomId, messageId)])
  emitToUsers(userIds, 'message-deleted', payload)
}

export const updatePinnedMessage = async (
  userId: string,
  { isPinned, messageId, roomId }: EventUpdatePinnedMessage
) => {
  const room = await findRoomUsersByMessage(roomId, userId, messageId)

  if (!room) {
    return
  }

  if (isPinned) {
    const message = await MessageModel.findOne({ _id: messageId, deletedForUserIds: { $ne: userId } })
      .select('_id')
      .lean<MessageIdProjection>()

    if (!message) return
  }

  const pinnedMessageId = isPinned ? messageId : null
  const updateResult = await updateRoomPinnedMessage(roomId, pinnedMessageId, isPinned ? undefined : messageId)

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
    findRoomUsersByMessage(roomId, userId, messageId),
    loadUserPublicNicknameById(userId)
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
      action: 'remove',
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
    action: 'add',
    reaction
  }

  emitToUsers(stringifyMongoIds(room.users), 'message-reaction-updated', payload)
}

export const emitRoomTypingStatus = async (userId: string, { roomId, isTyping }: EventUserTyping) => {
  const user = await loadUserRoleById(userId)

  if (!user) {
    return
  }

  const room = await findRoomUsersByUser(roomId, userId, user.system.role)

  if (!room) {
    return
  }

  const recipientIds = await loadRoomRecipientIds(room)
  const payload: EventRoomTypingStatus = {
    roomId,
    contactId: userId,
    isTyping
  }

  emitToUsers(getRoomOtherUserIds({ users: recipientIds }, userId), 'room-typing-status', payload)
}

export const sendMessage = async ({ roomId, userId, message, presenceService }: SendMessageParams) => {
  const messageImages = message.images ?? []
  const messageDocuments = message.documents ?? []
  const messageAudios = message.audios ?? []
  const messageVideos = message.videos ?? []

  assertMessageContentLimits(message.body, messageImages, messageDocuments, messageAudios, messageVideos)

  const author = await loadUserPublicNicknameAndRoleById(userId)
  const authorRole = author?.system?.role ?? 'user'
  const room = await findRoomUsersAndMessagesByUser(roomId, userId, authorRole)

  if (!room || !author || !canSendMessageToRoom(room, userId, authorRole)) {
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

  const supportAgentMessage = isSupportAgentMessage(room, authorRole)
  const trustedMessage: Message = {
    ...message,
    authorId: userId,
    authorNickname: supportAgentMessage ? '' : author.public.nickname,
    ...(supportAgentMessage && { authorKind: 'support' })
  }
  const newDbMessage = await new MessageModel({
    _id: message.id,
    ...trustedMessage,
    reactions: [],
    images,
    documents,
    audios,
    videos,
    linkPreview,
    usersMetaData: [],
    repliedMessage
  }).save()
  const recipientIds = await loadRoomRecipientIds(room)

  await addMessageToRoom(roomId, userId, newDbMessage.id, authorRole)
  await reopenSupportChatIfNeeded(roomId, room, presenceService)

  await Promise.all(
    recipientIds.map(async (userId) => {
      await MessageModel.updateOne(
        { _id: newDbMessage.id },
        { $push: { usersMetaData: { id: userId, status: 'delivered' } } }
      )

      const payload: EventMessageDelivered = {
        roomId,
        message: {
          ...trustedMessage,
          id: newDbMessage.id,
          images,
          documents,
          audios,
          videos,
          linkPreview,
          repliedMessage,
          isSelf: isMessageAuthor(trustedMessage, userId),
          status: 'delivered'
        }
      }

      emitToUsers([userId], 'message-delivered', payload)
    })
  )
  refreshMessageLinkPreview({
    appName: SERVER_ENV.info.appName,
    linkPreview,
    messageId: newDbMessage.id,
    roomId,
    userIds: recipientIds
  })
}
