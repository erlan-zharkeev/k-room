import { SocketInstanceType } from 'src/shared/config'
import { socketErrorMiddleware } from 'src/shared/middleware/socket-error-middleware'

import { USER_SOCKET_I18N } from '../config/i18n'
import { updateOnlineStatusController } from '../update-online-status/controller'

export const userConnectController = (socket: SocketInstanceType) => {
  void socketErrorMiddleware(
    socket,
    async () => {
      await updateOnlineStatusController(socket.data.userId, true)
    },
    { basicError: USER_SOCKET_I18N.userConnectFailed }
  )()
}
