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
