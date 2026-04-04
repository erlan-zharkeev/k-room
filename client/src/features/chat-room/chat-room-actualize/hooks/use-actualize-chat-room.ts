import { SocketActionsType } from 'common'

import { transformRoomData } from 'src/features/chat-room/shared'

import { useChatRoom } from 'src/entities/chat-room'

import { socket } from 'src/shared/api'
import { FChatRoomType } from 'src/shared/config'

export const useChatRoomActualize = () => {
  const { replaceAll } = useChatRoom()

  const actualizeChatRooms = async (chatRooms: FChatRoomType[]) => {
    const rooms = chatRooms.map((room) => transformRoomData(room))
    await replaceAll(rooms)
  }

  const monitorChatRoomActualize = () => {
    socket.on<SocketActionsType>('actual-chat-rooms', actualizeChatRooms)
  }

  return {
    monitorChatRoomActualize
  }
}
