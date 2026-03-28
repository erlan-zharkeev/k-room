import { controller as changeMessageStatusController } from 'src/features/message/change-message-status'
import { controller as loadRoomMessagesController } from 'src/features/message/load-room-messages'
import { controller as sendMessageController } from 'src/features/message/send-message'
import { SocketInstanceType } from 'src/shared/config'

const controllers = [sendMessageController, changeMessageStatusController, loadRoomMessagesController]

export const socketMessageRouter = (socket: SocketInstanceType) => {
  controllers.forEach((controller) => controller(socket))
}
