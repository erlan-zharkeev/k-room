import { SocketActionsType } from 'common'

import { useChatRoom } from 'src/entities/chat-room'

import { socket } from 'src/shared/api'
import { FChatRoomType } from 'src/shared/config'

import { transformRoomData } from '../../shared'

export const useAddRoom = () => {
  const { putChatRoom } = useChatRoom()

  const monitorRoomAddition = () => {
    socket.on<SocketActionsType>('new-room-added', roomAdditionHandler)
  }

  const roomAdditionHandler = (data: FChatRoomType) => {
    putChatRoom(transformRoomData(data))
  }

  return { monitorRoomAddition }
}
