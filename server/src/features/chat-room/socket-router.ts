import { controller as createChatRoomController } from 'features/chat-room/create-chat-room'
import { controller as getChatRooms } from 'features/user/actualize-user-data'

import { SocketInstanceType } from 'shared-config'

const controllers = [createChatRoomController, getChatRooms]

export const socketChatRoomRouter = (socket: SocketInstanceType) => {
  controllers.forEach((controller) => controller(socket))
}