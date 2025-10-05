import { SocketInstanceType } from 'shared-config'

import { controller as createChatRoomController } from './create-chat-room'

const controllers = [createChatRoomController]

export const socketChatRoomRouter = (socket: SocketInstanceType) => {
  controllers.forEach((controller) => controller(socket))
}