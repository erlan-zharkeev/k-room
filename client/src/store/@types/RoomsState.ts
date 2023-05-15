import { ChatRoom, Message } from 'common-types'

export interface RoomsState {
  chatRooms: Array<ChatRoom>
  repliedMessageData: Message
}
