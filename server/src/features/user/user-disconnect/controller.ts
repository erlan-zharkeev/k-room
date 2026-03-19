import { SocketActionsType } from 'common-types'
import { SocketInstanceType } from 'shared-config'

import { setLastSeenData } from '../~shared'
import { updateOnlineStatus } from '../update-online-status'

export const controller = (socket: SocketInstanceType) => {
  const { userId } = socket.data

  socket.on<SocketActionsType>('disconnect', async () => {
    await updateOnlineStatus(userId, false)
    await setLastSeenData(userId)
  })
}
