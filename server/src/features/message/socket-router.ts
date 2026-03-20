import { SocketInstanceType } from 'shared-config'

import { controller as changeMessageStatusController } from './change-message-status/controller'
import { controller as sendMessageController } from './send-message/controller'

const controllers = [sendMessageController, changeMessageStatusController]

export const socketMessageRouter = (socket: SocketInstanceType) => {
  controllers.forEach((controller) => controller(socket))
}
