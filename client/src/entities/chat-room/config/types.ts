import { IChatRoom } from 'common-types'

export interface IAppChatRoom extends IChatRoom {
  lastScrolledMessageId?: string
}

export interface IRoomState {
  chatRooms: IAppChatRoom[]
}
