import { SocketActionsType } from 'common'

import { updateOnlineStatusController } from 'src/features/user'

import { SocketInstanceType } from 'src/shared/config'

export const interlocutorPingController = (socket: SocketInstanceType) => {
  socket.on<SocketActionsType>('interlocutor-ping', async () => {
    const { userId } = socket.data
    await updateOnlineStatusController(userId, true)
  })
}
