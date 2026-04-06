import { SocketInstanceType } from 'src/shared/config'
import { socketErrorMiddleware } from 'src/shared/middleware'

import { USER_SOCKET_I18N } from './../config'
import { updateOnlineStatusController } from './../update-online-status'

export const userConnectController = (socket: SocketInstanceType) => {
  void socketErrorMiddleware(
    socket,
    async () => {
      await updateOnlineStatusController(socket.data.userId, true)
    },
    { basicError: USER_SOCKET_I18N.userConnectFailed }
  )()
}
