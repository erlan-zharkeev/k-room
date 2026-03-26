import { controller as changeMessageStatusController } from 'features/message/change-message-status/controller'
import { controller as loadRoomMessagesController } from 'features/message/load-room-messages/controller'
import { controller as sendMessageController } from 'features/message/send-message/controller'

import { SocketInstanceType } from 'shared-config'

const controllers = [sendMessageController, changeMessageStatusController, loadRoomMessagesController]

export const socketMessageRouter = (socket: SocketInstanceType) => {
  controllers.forEach((controller) => controller(socket))
}
