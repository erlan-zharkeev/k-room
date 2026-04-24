import { IChatRoom } from 'common'

export interface IAppChatRoom extends IChatRoom {
  lastScrolledMessageId?: string
}

export interface IRoomState {
  chatRooms: IAppChatRoom[]
}
