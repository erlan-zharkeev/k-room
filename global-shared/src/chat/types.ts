import { CHAT_KIND } from './constants'

export type ChatKindType = (typeof CHAT_KIND)[keyof typeof CHAT_KIND]

export interface IChatRoom {
  id: string
  authorId: string
  chatName?: string
  chatKind: ChatKindType
  avatarId: string
  lastMessageId: string | null
  unreadMessagesQuantity: number
  isPinned: boolean
  pinnedOrder: number | null
  users: string[]
  messages: string[]
}

export type ChatRoomsType = IChatRoom[]

export interface IChatRoomSchema
  extends Omit<
    IChatRoom,
    'users' | 'avatarId' | 'lastMessageId' | 'unreadMessagesQuantity' | 'isPinned' | 'pinnedOrder'
  > {
  users: string[]
}
