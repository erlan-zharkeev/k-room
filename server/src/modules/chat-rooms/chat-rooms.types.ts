import type { ChatRoom } from 'global-shared'
import type { Types } from 'mongoose'

export interface ChatRoomSchema
  extends Omit<
    ChatRoom,
    'id' | 'users' | 'lastMessageId' | 'unreadMessagesQuantity' | 'isPinned' | 'pinnedOrder' | 'isMuted'
  > {
  users: string[]
}

export interface ChatRoomDocument extends ChatRoomSchema {
  _id: Types.ObjectId
}

export interface TransformRoomForUserParams {
  userId: string
  room: ChatRoomDocument
  pinnedChatRoomIds: string[]
  mutedChatRoomIds: string[]
}
