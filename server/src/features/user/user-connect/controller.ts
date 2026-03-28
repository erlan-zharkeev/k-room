import { updateOnlineStatus } from 'src/features/user'

import { SocketInstanceType } from 'src/shared/config'

export const updateUserConnection = (socket: SocketInstanceType) => {
  void updateOnlineStatus(socket.data.userId, true)
}
