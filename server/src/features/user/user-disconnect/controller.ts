import { SocketActionsType } from 'common'

import { setLastSeenData } from 'src/features/user'
import { updateOnlineStatus } from 'src/features/user/update-online-status'

import { SocketInstanceType } from 'src/shared/config'

export const controller = (socket: SocketInstanceType) => {
  socket.on<SocketActionsType>('disconnect', async () => {
    const { userId } = socket.data
    const lastSeen = await setLastSeenData(userId)
    await updateOnlineStatus(userId, false, lastSeen)
  })
}
