import { useTimeout } from 'src/shared/lib'

import { useChatRoom } from './use-chat-room'

export const useChatRoomScroll = () => {
  const { selectedChatRoom } = useChatRoom()
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
