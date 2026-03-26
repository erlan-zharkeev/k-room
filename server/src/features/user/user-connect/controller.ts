import { updateOnlineStatus } from 'features/user/update-online-status'

import { SocketInstanceType } from 'shared-config'

export const controller = (socket: SocketInstanceType) => {
  void updateOnlineStatus(socket.data.userId, true)
}
