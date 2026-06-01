import type { MediaFileValue, MediaId } from '../media/types'
import type { Message } from '../message/types'

import { CHAT_KIND } from './constants'

export type ChatKind = (typeof CHAT_KIND)[keyof typeof CHAT_KIND]

export interface ChatRoom {
  id: string
  adminId: string
  createdAt: number
  chatName?: string
  chatKind: ChatKind
  avatarId: MediaId
  lastMessageId: string | null
  pinnedMessageId: string | null
  unreadMessagesQuantity: number
  isPinned: boolean
  pinnedOrder: number | null
  isMuted: boolean
  users: string[]
  messages: string[]
}

export type ChatRooms = ChatRoom[]

export interface EventGetRoom extends ChatRoom {
  previewMessage?: Message | null
  pinnedMessage?: Message | null
}

export type EventGetRooms = EventGetRoom[]

export interface EventCreateRoom {
  memberIds: string[]
  chatName?: string
  avatarFile?: MediaFileValue
}

export interface EventUpdateChatRoom {
  roomId: string
  memberIds: string[]
  chatName: string
  avatarFile?: MediaFileValue | null
}

export interface EventDeleteChatRoom {
  roomId: string
}

export interface EventChatRoomDeleted {
  roomId: string
}

export interface EventLeaveChatRoom {
  roomId: string
  nextAdminId?: string
}

export interface EventChatRoomLeft {
  roomId: string
}

export interface EventUpdatePinnedChatRoom {
  roomId: string
  isPinned: boolean
}

export interface EventUpdatePinnedChatRoomOrder {
  pinnedChatRoomIds: string[]
}

export interface EventPinnedChatRoomsUpdated {
  roomId?: string
  isPinned?: boolean
  pinnedChatRoomIds: string[]
}

export interface EventUpdateMutedChatRoom {
  roomId: string
  isMuted: boolean
}

export interface EventMutedChatRoomsUpdated {
  roomId?: string
  isMuted?: boolean
  mutedChatRoomIds: string[]
}

export interface EventUserTyping {
  roomId: string
  isTyping: boolean
}

export interface EventRoomTypingStatus {
  roomId: string
  contactId: string
  isTyping: boolean
}

export interface EventMarkRoomAsRead {
  roomId: string
}

export interface CreateRoomAckPayload {
  roomId: string
}
