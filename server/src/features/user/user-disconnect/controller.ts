import { SocketActionsType } from 'common'

import { setLastSeenData } from 'features/user'

import { SocketInstanceType } from 'shared-config'

import { updateOnlineStatus } from '../update-online-status'

export const controller = (socket: SocketInstanceType) => {
  socket.on<SocketActionsType>('disconnect', async () => {
    const { userId } = socket.data
    const lastSeen = await setLastSeenData(userId)
    await updateOnlineStatus(userId, false, lastSeen)
  })
}
