import { ChatRoom } from 'k-room.types'

export interface ChatRoomsState {
  chatRooms: Array<ChatRoom>
  selectedChatRoomId: string
}
