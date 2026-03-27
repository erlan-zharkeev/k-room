import { controller as createChatRoomController } from 'features/chat-room/create-chat-room'

import { SocketInstanceType } from 'shared-config'

const controllers = [createChatRoomController]

export const socketChatRoomRouter = (socket: SocketInstanceType) => {
  controllers.forEach((controller) => controller(socket))
}
