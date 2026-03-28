import { SocketInstanceType } from 'src/shared/config'

import { updateOnlineStatusController } from './../update-online-status'

export const userConnectController = (socket: SocketInstanceType) => {
  void updateOnlineStatusController(socket.data.userId, true)
}
