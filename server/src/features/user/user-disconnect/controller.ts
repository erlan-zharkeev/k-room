import { SocketActionsType } from 'common'

import { setLastSeenData } from 'features/user'
import { updateOnlineStatus } from 'features/user/update-online-status'

import { SocketInstanceType } from 'shared-config'

export const controller = (socket: SocketInstanceType) => {
  socket.on<SocketActionsType>('disconnect', async () => {
    const { userId } = socket.data
    const lastSeen = await setLastSeenData(userId)
    await updateOnlineStatus(userId, false, lastSeen)
  })
}
