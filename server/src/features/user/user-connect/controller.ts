import { updateOnlineStatus } from 'src/features/user/update-online-status'

import { SocketInstanceType } from 'src/shared/config'

export const controller = (socket: SocketInstanceType) => {
  void updateOnlineStatus(socket.data.userId, true)
}
