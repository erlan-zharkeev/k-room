import { updateOnlineStatusController } from './../update-online-status'

import { SocketInstanceType } from 'src/shared/config'

export const userConnectController = (socket: SocketInstanceType) => {
  void updateOnlineStatusController(socket.data.userId, true)
}
