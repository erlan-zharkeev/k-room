import { ChatRoom } from './../../../../types'

export interface ChatRoomsState {
  chatRooms: Array<ChatRoom>
  selectedChatRoomId: string
}
