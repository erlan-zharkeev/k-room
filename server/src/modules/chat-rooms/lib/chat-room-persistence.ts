import { ChatRoomModel } from '../chat-rooms.model'
import type {
  ChatRoomCallAccessProjection,
  ChatRoomDocument,
  ChatRoomIdProjection,
  ChatRoomMessagesProjection,
  ChatRoomUsersMessagesProjection,
  ChatRoomUsersProjection
} from '../chat-rooms.types'

export const findRoomUsersByMessage = (roomId: string, userId: string, messageId: string) => {
  return ChatRoomModel.findOne({ _id: roomId, users: userId, messages: messageId })
    .select('users')
    .lean<ChatRoomUsersProjection>()
}

export const findRoomMessagesByUser = (roomId: string, userId: string) => {
  return ChatRoomModel.findOne({ _id: roomId, users: userId }).select('messages').lean<ChatRoomMessagesProjection>()
}

export const findRoomUsersByUser = (roomId: string, userId: string) => {
  return ChatRoomModel.findOne({ _id: roomId, users: userId }).select('users -_id').lean<ChatRoomUsersProjection>()
}

export const findRoomCallAccessByUser = (roomId: string, userId: string) => {
  return ChatRoomModel.findOne({ _id: roomId, users: userId })
    .select('users chatKind -_id')
    .lean<ChatRoomCallAccessProjection>()
}

export const findRoomUsersAndMessagesByUser = (roomId: string, userId: string) => {
  return ChatRoomModel.findOne({ _id: roomId, users: userId })
    .select('users messages')
    .lean<ChatRoomUsersMessagesProjection>()
}

export const findSourceRoomByMessageForUser = (userId: string, messageId: string) => {
  return ChatRoomModel.findOne({ users: userId, messages: messageId }).select('_id').lean<ChatRoomIdProjection>()
}

export const addMessageToRoom = (roomId: string, userId: string, messageId: string) => {
  return ChatRoomModel.updateOne({ _id: roomId, users: userId }, { $push: { messages: messageId } })
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
