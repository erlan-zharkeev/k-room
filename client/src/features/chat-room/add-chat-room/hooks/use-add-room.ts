import { SocketActionsType } from 'common-types'

import { useChatRoom } from 'src/entities/chat-room'

import { socket } from 'src/shared/api'
import { DbChatRoomType } from 'src/shared/config'

import { transformRoomData } from '../../~shared'

export const useAddRoom = () => {
  const { putChatRoom } = useChatRoom()

  const monitorRoomAddition = () => {
    socket.on<SocketActionsType>('new-room-added', roomAdditionHandler)
  }

  const roomAdditionHandler = (data: DbChatRoomType) => {
    putChatRoom(transformRoomData(data))
  }

  return { monitorRoomAddition }
}
