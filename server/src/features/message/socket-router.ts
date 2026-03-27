import { controller as changeMessageStatusController } from 'features/message/change-message-status'
import { controller as loadRoomMessagesController } from 'features/message/load-room-messages'
import { controller as sendMessageController } from 'features/message/send-message'

import { SocketInstanceType } from 'shared-config'

const controllers = [sendMessageController, changeMessageStatusController, loadRoomMessagesController]

export const socketMessageRouter = (socket: SocketInstanceType) => {
  controllers.forEach((controller) => controller(socket))
}
