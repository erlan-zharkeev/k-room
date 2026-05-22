import { CHAT_KIND } from './constants'

export type ChatKindType = (typeof CHAT_KIND)[keyof typeof CHAT_KIND]

export interface ChatRoomType {
  id: string
  adminId: string
  createdAt: number
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

export type ChatRoomsType = ChatRoomType[]

export interface ChatRoomSchemaType
  extends Omit<
    ChatRoomType,
    'users' | 'avatarId' | 'lastMessageId' | 'unreadMessagesQuantity' | 'isPinned' | 'pinnedOrder'
  > {
  users: string[]
}
