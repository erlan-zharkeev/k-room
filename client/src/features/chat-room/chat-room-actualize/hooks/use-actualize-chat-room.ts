import { SocketActionsType } from 'common'

import { transformRoomData } from 'src/features/chat-room/shared'

import { useChatRoom } from 'src/entities/chat-room'

import { socket } from 'src/shared/api'
import { FChatRoomType } from 'src/shared/config'

export const useChatRoomActualize = () => {
  const { mergeMany } = useChatRoom()

  const actualizeChatRooms = async (chatRooms: FChatRoomType[]) => {
    const rooms = chatRooms.map((room) => transformRoomData(room))

    await mergeMany(rooms, {
      merge: (_current, incoming) => incoming,
      removeMissing: true
    })
  }

  const monitorChatRoomActualize = () => {
    socket.on<SocketActionsType>('actual-chat-rooms', actualizeChatRooms)
  }

  return {
    monitorChatRoomActualize
  }
}
