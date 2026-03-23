import { ChatRoom } from 'src/widgets/chat-room'

import { useChatRoom } from 'src/entities/chat-room'

export const SelectedChatRoom = () => {
  const { selectedChatRoom } = useChatRoom()

  return <ChatRoom room={selectedChatRoom} />
}
