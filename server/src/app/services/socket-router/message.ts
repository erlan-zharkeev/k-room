import { changeMessageStatusController, loadRoomMessagesController, sendMessageController } from 'src/features/message'

import { SocketInstanceType } from 'src/shared/config'

const controllers = [sendMessageController, changeMessageStatusController, loadRoomMessagesController]

export const socketMessageRouter = (socket: SocketInstanceType) => {
  controllers.forEach((controller) => controller(socket))
}
