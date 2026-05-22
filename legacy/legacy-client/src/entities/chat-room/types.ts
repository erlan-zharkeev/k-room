import { IChatRoom } from 'common'

export interface AppChatRoom extends IChatRoom {
  lastScrolledMessageId?: string
}

export interface RoomState {
  chatRooms: AppChatRoom[]
}
