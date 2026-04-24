import { SocketActionsType } from 'common'

import { SocketInstanceType } from 'src/shared/config'
import { socketErrorMiddleware } from 'src/shared/middleware/socket-error-middleware'

import { USER_SOCKET_I18N } from '../config/i18n'
import { setLastSeenData } from '../shared/lib/set-last-seen-data'
import { updateOnlineStatusController } from '../update-online-status/controller'

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
