import type { SupportChatStatus, UserRole } from 'global-shared'

import { ChatRoomModel } from '../chat-rooms.model'
import type {
  ChatRoomCallAccessProjection,
  ChatRoomDocument,
  ChatRoomIdProjection,
  ChatRoomMessagesProjection,
  ChatRoomUsersMessagesProjection,
  ChatRoomUsersProjection
} from '../chat-rooms.types'

const buildRoomAccessQuery = (roomId: string, userId: string, userRole: UserRole = 'user') => {
  if (userRole === 'admin') {
    return {
      _id: roomId,
      $or: [{ users: userId }, { chatKind: 'support' }]
    }
  }

  return {
    _id: roomId,
    users: userId
  }
}

export const findRoomUsersByMessage = (
  roomId: string,
  userId: string,
  messageId: string,
  userRole: UserRole = 'user'
) => {
  return ChatRoomModel.findOne({ ...buildRoomAccessQuery(roomId, userId, userRole), messages: messageId })
    .select('chatKind supportOwnerId users')
    .lean<ChatRoomUsersProjection>()
}

export const findRoomMessagesByUser = (roomId: string, userId: string, userRole: UserRole = 'user') => {
  return ChatRoomModel.findOne(buildRoomAccessQuery(roomId, userId, userRole))
    .select('messages')
    .lean<ChatRoomMessagesProjection>()
}

export const findRoomUsersByUser = (roomId: string, userId: string, userRole: UserRole = 'user') => {
  return ChatRoomModel.findOne(buildRoomAccessQuery(roomId, userId, userRole))
    .select('chatKind supportOwnerId users -_id')
    .lean<ChatRoomUsersProjection>()
}

export const findRoomCallAccessByUser = (roomId: string, userId: string) => {
  return ChatRoomModel.findOne({ _id: roomId, users: userId })
    .select('users chatKind -_id')
    .lean<ChatRoomCallAccessProjection>()
}

export const findRoomUsersAndMessagesByUser = (roomId: string, userId: string, userRole: UserRole = 'user') => {
  return ChatRoomModel.findOne(buildRoomAccessQuery(roomId, userId, userRole))
    .select('adminId chatKind supportOwnerId supportStatus users messages')
    .lean<ChatRoomUsersMessagesProjection>()
}

export const findSourceRoomByMessageForUser = (userId: string, messageId: string) => {
  return ChatRoomModel.findOne({ users: userId, messages: messageId }).select('_id').lean<ChatRoomIdProjection>()
}

export const addMessageToRoom = (roomId: string, userId: string, messageId: string, userRole: UserRole = 'user') => {
  return ChatRoomModel.updateOne(buildRoomAccessQuery(roomId, userId, userRole), { $push: { messages: messageId } })
}

export const removeMessageFromRoom = (roomId: string, messageId: string) => {
  return ChatRoomModel.updateOne({ _id: roomId }, { $pull: { messages: messageId } })
}

export const clearPinnedMessageFromRoom = (roomId: string, messageId: string) => {
  return ChatRoomModel.updateOne({ _id: roomId, pinnedMessageId: messageId }, { $set: { pinnedMessageId: null } })
}

export const updateRoomPinnedMessage = (
  roomId: string,
  pinnedMessageId: string | null,
  currentPinnedMessageId?: string
) => {
  const query = currentPinnedMessageId ? { _id: roomId, pinnedMessageId: currentPinnedMessageId } : { _id: roomId }

  return ChatRoomModel.updateOne(query, { $set: { pinnedMessageId } })
}

export const loadChatRoomUsersByUserId = (userId: string) => {
  return ChatRoomModel.find({ users: userId }, { users: 1 }).lean<ChatRoomUsersProjection[]>()
}

export const loadChatRoomsByIds = (roomIds: string[]) => {
  return ChatRoomModel.find({ _id: { $in: roomIds } }).lean<ChatRoomDocument[]>()
}

export const loadSupportChatRooms = () => {
  return ChatRoomModel.find({ chatKind: 'support' }).lean<ChatRoomDocument[]>()
}

export const updateSupportChatRoomStatus = (roomId: string, supportStatus: SupportChatStatus) => {
  return ChatRoomModel.findOneAndUpdate(
    { _id: roomId, chatKind: 'support' },
    { $set: { supportStatus } },
    { new: true }
  )
    .select('-__v')
    .lean<ChatRoomDocument>()
}
