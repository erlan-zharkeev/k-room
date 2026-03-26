import { controller as userConnectController } from 'features/user/user-connect'
import { controller as userDisconnectController } from 'features/user/user-disconnect'

import { SocketInstanceType } from 'shared-config'

const controllers = [userConnectController, userDisconnectController]

export const socketUserRouter = (socket: SocketInstanceType) => {
  controllers.forEach((controller) => controller(socket))
}
