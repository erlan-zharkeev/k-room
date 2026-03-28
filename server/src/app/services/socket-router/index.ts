import { SocketInstanceType } from 'src/shared/config'

import { socketCallRouter } from './call'
import { socketChatRoomRouter } from './chat-room'
import { socketContactRouter } from './contact'
import { socketMessageRouter } from './message'
import { socketUserRouter } from './user'

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
