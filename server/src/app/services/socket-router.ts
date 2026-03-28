import { socketCallRouter } from 'src/features/call'
import { socketChatRoomRouter } from 'src/features/chat-room'
import { socketContactRouter } from 'src/features/contact'
import { socketMessageRouter } from 'src/features/message'
import { socketUserRouter } from 'src/features/user'
import { SocketInstanceType } from 'src/shared/config'

const featureRouters = [
  socketUserRouter,
  socketChatRoomRouter,
  socketContactRouter,
  socketMessageRouter,
  socketCallRouter
]

export const socketRouter = (socket: SocketInstanceType) => {
  featureRouters.forEach((router) => router(socket))
}
