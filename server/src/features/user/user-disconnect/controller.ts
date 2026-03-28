import { SocketActionsType } from 'common'

import { SocketInstanceType } from 'src/shared/config'

import { setLastSeenData } from './../shared'
import { updateOnlineStatusController } from './../update-online-status'

export const userDisconnectController = (socket: SocketInstanceType) => {
  socket.on<SocketActionsType>('disconnect', async () => {
    const { userId } = socket.data
    const lastSeen = await setLastSeenData(userId)
    await updateOnlineStatusController(userId, false, lastSeen)
  })
}
