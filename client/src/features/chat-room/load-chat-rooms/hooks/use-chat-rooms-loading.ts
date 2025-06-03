import { SocketActionsType, EventGetRoomsType } from 'common-types'
import { useDispatch } from 'react-redux'

import { loadChatRooms } from 'src/entities/chat-room'

import { socket } from 'src/shared/api'

export const useChatRoomsLoading = () => {
  const dispatch = useDispatch()

  const monitorChatRoomLoading = () => {
    socket.on<SocketActionsType>('rooms-loaded', (payload: EventGetRoomsType) => {
      dispatch(loadChatRooms(payload))
    })
  }
  return {
    monitorChatRoomLoading
  }
}
