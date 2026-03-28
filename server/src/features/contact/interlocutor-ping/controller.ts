import { SocketActionsType } from 'common'

import { updateOnlineStatus } from 'src/features/user/update-online-status'

import { SocketInstanceType } from 'src/shared/config'

export const controller = (socket: SocketInstanceType) => {
  socket.on<SocketActionsType>('interlocutor-ping', async () => {
    const { userId } = socket.data
    await updateOnlineStatus(userId, true)
  })
}
