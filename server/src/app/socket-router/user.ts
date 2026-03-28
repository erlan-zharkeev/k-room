import { updateUserConnection as userConnectController } from 'src/features/user/user-connect'
import { controller as userDisconnectController } from 'src/features/user/user-disconnect'
import { SocketInstanceType } from 'src/shared/config'

const controllers = [userConnectController, userDisconnectController]

export const socketUserRouter = (socket: SocketInstanceType) => {
  controllers.forEach((controller) => controller(socket))
}
