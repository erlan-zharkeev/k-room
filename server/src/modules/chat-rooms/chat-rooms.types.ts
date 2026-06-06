import type { ChatRoom } from 'global-shared'
import type { Types } from 'mongoose'

export type ChatRoomSchema = Omit<
  ChatRoom,
  'id' | 'lastMessageId' | 'unreadMessagesQuantity' | 'isPinned' | 'pinnedOrder' | 'isMuted'
>

export interface ChatRoomDocument extends ChatRoomSchema {
  _id: Types.ObjectId
}

export interface TransformRoomForUserParams {
  userId: string
  room: ChatRoomDocument
  pinnedChatRoomIds: string[]
  mutedChatRoomIds: string[]
}

export type ChatRoomUsersProjection = Pick<ChatRoomSchema, 'users'>

export type ChatRoomMessagesProjection = Pick<ChatRoomSchema, 'messages'>

export type ChatRoomUsersMessagesProjection = Pick<ChatRoomSchema, 'users' | 'messages'>

export type ChatRoomCallAccessProjection = Pick<ChatRoomSchema, 'users' | 'chatKind'>

export type ChatRoomIdProjection = Pick<ChatRoomDocument, '_id'>

export type ChatRoomDeleteProjection = Pick<ChatRoomSchema, 'adminId' | 'avatarId' | 'chatKind' | 'users' | 'messages'>
