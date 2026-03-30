import { updateLanguageController, userConnectController, userDisconnectController } from 'src/features/user'

import { SocketInstanceType } from 'src/shared/config'

const controllers = [userConnectController, userDisconnectController, updateLanguageController]

export const socketUserRouter = (socket: SocketInstanceType) => {
  controllers.forEach((controller) => controller(socket))
}
