import { IEventLoadRoomMessages, SocketActionsType } from 'common'

import { loadRoomMessages } from './~shared'

import { SocketInstanceType } from 'src/shared/config'
import { getIO } from 'src/shared/lib'

export const loadRoomMessagesController = (socket: SocketInstanceType) => {
  socket.on<SocketActionsType>('load-room-messages', async (payload: IEventLoadRoomMessages) => {
    const { userId } = socket.data
    const roomMessagesData = await loadRoomMessages(userId, payload)

    if (!roomMessagesData) return

    getIO().to(socket.id).emit<SocketActionsType>('room-messages-loaded', roomMessagesData)
  })
}
