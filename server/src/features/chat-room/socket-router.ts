import { SocketInstanceType } from 'shared-config'

import { controller as getChatRooms } from '../user/actualize-user-data'

import { controller as createChatRoomController } from './create-chat-room'

const controllers = [createChatRoomController, getChatRooms]

export const socketChatRoomRouter = (socket: SocketInstanceType) => {
  controllers.forEach((controller) => controller(socket))
}