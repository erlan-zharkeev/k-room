import { SocketInstanceType } from 'shared-config'

import { controller as userConnectController } from './user-connect'
import { controller as userDisconnectController } from './user-disconnect'

const controllers = [userConnectController, userDisconnectController]

export const socketUserRouter = (socket: SocketInstanceType) => {
  controllers.forEach((controller) => controller(socket))
}
