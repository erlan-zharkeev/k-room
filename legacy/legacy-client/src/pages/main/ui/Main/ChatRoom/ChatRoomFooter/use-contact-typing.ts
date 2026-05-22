import { EventUserTyping, SocketActions } from 'common'

import { useChatRoom } from 'src/entities/chat-room'
import { useUser } from 'src/entities/user'

import { socket } from 'src/shared/api'
import { useDebounce } from 'src/shared/lib'

export const useContactTyping = () => {
  const { username } = useUser()
  const chatRoomData = useChatRoom()

  const sendUserTypingStatus = (isTyping: boolean) => {
    if (!chatRoomData.selectedChatRoom) return
    const payload: EventUserTyping = {
      authorName: username,
      usersTo: chatRoomData.selectedChatRoom.users,
      isTyping
    }
    socket.emit<SocketActions>('client-typing', payload)
  }

  const debouncedChangeTypeStatus = useDebounce(sendUserTypingStatus, 2000)

  return { sendUserTypingStatus, debouncedChangeTypeStatus }
}
