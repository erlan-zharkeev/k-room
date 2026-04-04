import { SocketActionsType } from 'common'

import { SocketInstanceType } from 'src/shared/config'
import { socketErrorMiddleware } from 'src/shared/middleware/socket-error-middleware'

import { USER_SOCKET_I18N } from './../config'
import { setLastSeenData } from './../shared'
import { updateOnlineStatusController } from './../update-online-status'

export const userDisconnectController = (socket: SocketInstanceType) => {
  socket.on<SocketActionsType>(
    'disconnect',
    socketErrorMiddleware(
      socket,
      async () => {
        const { userId } = socket.data
        const lastSeen = await setLastSeenData(userId)
        await updateOnlineStatusController(userId, false, lastSeen)
      },
      { basicError: USER_SOCKET_I18N.userDisconnectFailed }
    )
  )
}
