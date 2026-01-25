import { SocketActionsType } from 'common-types'

import { socket } from 'src/shared/api'
import { DbChatRoomType } from 'src/shared/config'
import { db } from 'src/shared/lib'

import { transformRoomData } from '../../~shared'

export const useChatRoomActualize = () => {
  const actualizeChatRooms = async (chatRooms: DbChatRoomType[]) => {
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
