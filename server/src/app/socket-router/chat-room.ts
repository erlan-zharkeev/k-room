import { controller as createChatRoomController } from 'src/features/chat-room/create-chat-room'
import { SocketInstanceType } from 'src/shared/config'

const controllers = [createChatRoomController]

export const socketChatRoomRouter = (socket: SocketInstanceType) => {
  controllers.forEach((controller) => controller(socket))
}
