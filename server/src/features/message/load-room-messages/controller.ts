import { IEventLoadRoomMessages, SocketActionsType } from 'common-types'
import { SocketInstanceType } from 'shared-config'
import { getIO } from 'shared-lib'

import { loadRoomMessages } from './~shared'

export const controller = (socket: SocketInstanceType) => {
  socket.on<SocketActionsType>('load-room-messages', async (payload: IEventLoadRoomMessages) => {
    const { userId } = socket.data
    const roomMessagesData = await loadRoomMessages(userId, payload)

    if (!roomMessagesData) return

    getIO().to(socket.id).emit<SocketActionsType>('room-messages-loaded', roomMessagesData)
  })
}
