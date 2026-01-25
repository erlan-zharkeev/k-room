import { SocketInstanceType } from 'shared-config'

import { controller as sendMessageController } from './send-message/controller'

const controllers = [sendMessageController]

export const socketMessageRouter = (socket: SocketInstanceType) => {
  controllers.forEach((controller) => controller(socket))
}