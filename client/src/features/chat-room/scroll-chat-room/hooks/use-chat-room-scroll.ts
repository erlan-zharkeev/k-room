import { useChatRooms } from 'src/entities/chat-room'

import { useTimeout } from 'src/shared/lib'

export const useChatRoomScroll = () => {
  const { selectedChatRoom } = useChatRooms()
  const { delay } = useTimeout()

  const scrollToBottom = async () => {
    if (selectedChatRoom?.id) {
      const roomDOMEl = document.getElementById(selectedChatRoom.id)
      await delay(100)
      roomDOMEl?.scrollTo({ top: roomDOMEl.scrollHeight })
    }
  }
  return { scrollToBottom }
}
