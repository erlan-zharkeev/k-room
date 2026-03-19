import { SocketInstanceType } from 'shared-config'

import { updateOnlineStatus } from '../update-online-status'

export const controller = (socket: SocketInstanceType) => {
  void updateOnlineStatus(socket.data.userId, true)
}
