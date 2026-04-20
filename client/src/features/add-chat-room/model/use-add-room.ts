import { SocketActionsType } from 'common'

import { transformRoomData } from 'src/features/chat-room-shared'

import { useChatRoom } from 'src/entities/chat-room'

import { socket } from 'src/shared/api'
import { FChatRoomType } from 'src/shared/config'

export const useAddRoom = () => {
  const { put } = useChatRoom()

  const monitorRoomAddition = () => {
    socket.on<SocketActionsType>('new-room-added', roomAdditionHandler)
  }

  const roomAdditionHandler = (data: FChatRoomType) => {
    void put(transformRoomData(data))
  }

  return { monitorRoomAddition }
}
