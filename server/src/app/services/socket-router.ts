import { socketCallRouter, socketChatRoomRouter, socketContactRouter, socketMessageRouter, socketUserRouter } from 'src/app/socket-router'

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
