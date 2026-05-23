import { CHAT_KIND } from './constants'

export type ChatKind = (typeof CHAT_KIND)[keyof typeof CHAT_KIND]

export interface ChatRoom {
  id: string
  adminId: string
  createdAt: number
  chatName?: string
  chatKind: ChatKind
  avatarId: string
  lastMessageId: string | null
  unreadMessagesQuantity: number
  isPinned: boolean
  pinnedOrder: number | null
  isMuted: boolean
  users: string[]
  messages: string[]
}

export type ChatRooms = ChatRoom[]

export interface ChatRoomSchema
  extends Omit<
    ChatRoom,
    'users' | 'avatarId' | 'lastMessageId' | 'unreadMessagesQuantity' | 'isPinned' | 'pinnedOrder' | 'isMuted'
  > {
  users: string[]
}
