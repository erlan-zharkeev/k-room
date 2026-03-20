import { SocketActionsType } from 'common-types'
import { updateOnlineStatus } from 'features/user/update-online-status'
import { SocketInstanceType } from 'shared-config'

export const controller = (socket: SocketInstanceType) => {

  socket.on<SocketActionsType>('interlocutor-ping', async () => {
    const { userId } = socket.data
    await updateOnlineStatus(userId, true)
  })
}
