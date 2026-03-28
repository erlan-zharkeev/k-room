import { updateUserConnection as userConnectController } from 'src/features/user'
import { userDisconnectController } from 'src/features/user'

import { SocketInstanceType } from 'src/shared/config'

const controllers = [userConnectController, userDisconnectController]

export const socketUserRouter = (socket: SocketInstanceType) => {
  controllers.forEach((controller) => controller(socket))
}
