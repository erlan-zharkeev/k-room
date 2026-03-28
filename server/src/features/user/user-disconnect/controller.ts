import { SocketActionsType } from 'common'

import { setLastSeenData } from './../shared'
import { updateOnlineStatusController } from './../update-online-status'

import { SocketInstanceType } from 'src/shared/config'

export const userDisconnectController = (socket: SocketInstanceType) => {
  socket.on<SocketActionsType>('disconnect', async () => {
    const { userId } = socket.data
    const lastSeen = await setLastSeenData(userId)
    await updateOnlineStatusController(userId, false, lastSeen)
  })
}
