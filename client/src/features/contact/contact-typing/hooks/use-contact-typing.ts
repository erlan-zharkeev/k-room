import { IChatRoom, IEventUserTyping, SocketActionsType } from 'common-types'

import { useUser } from 'src/entities/user'

import { socket } from 'src/shared/api'
import { useDebounce } from 'src/shared/lib'

export const useContactTyping = (selectedChatRoom: IChatRoom) => {
  const { username } = useUser()

  const sendUserTypingStatus = (isTyping: boolean) => {
    const payload: IEventUserTyping = {
      authorName: username,
      usersTo: selectedChatRoom.users,
      isTyping
    }
    socket.emit<SocketActionsType>('client-typing', payload)
  }

  const debouncedChangeTypeStatus = useDebounce(sendUserTypingStatus, 2000)

  return { sendUserTypingStatus, debouncedChangeTypeStatus }
}
