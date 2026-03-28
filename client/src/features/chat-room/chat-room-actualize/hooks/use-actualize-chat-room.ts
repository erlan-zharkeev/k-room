import { SocketActionsType } from 'common'

import { transformRoomData } from 'src/features/chat-room/shared'

import { socket } from 'src/shared/api'
import { FChatRoomType } from 'src/shared/config'
import { db } from 'src/shared/lib'

export const useChatRoomActualize = () => {
  const actualizeChatRooms = async (chatRooms: FChatRoomType[]) => {
    await db.transaction('rw', db['chat-rooms'], async () => {
      await db['chat-rooms'].clear()
      if (chatRooms?.length) {
        const rooms = chatRooms.map((room) => transformRoomData(room))
        await db['chat-rooms'].bulkPut(rooms)
      }
    })
  }

  const monitorChatRoomActualize = () => {
    socket.on<SocketActionsType>('actual-chat-rooms', actualizeChatRooms)
  }

  return {
    monitorChatRoomActualize
  }
}
