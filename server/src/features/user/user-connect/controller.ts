import { updateOnlineStatus } from 'src/features/user'

import { SocketInstanceType } from 'src/shared/config'

export const userConnectController = (socket: SocketInstanceType) => {
  void updateOnlineStatus(socket.data.userId, true)
}
