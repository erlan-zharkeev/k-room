import './style.scss'
import { ChatRoomList, CreateChatRoomBtn } from 'src/features/chat-room'

import { AppHeader } from 'src/shared/ui'

export const ChatRooms = () => {
  return (
    <div className="chat-rooms">
      <CreateChatRoomBtn />
      <div className="divider" />
      <AppHeader tag="h4">Chat rooms</AppHeader>
      <ChatRoomList />
    </div>
  )
}
