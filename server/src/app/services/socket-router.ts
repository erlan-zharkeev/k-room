import { socketChatRoomRouter } from "features/chat-room"
import { socketContactRouter } from "features/contact"
import { socketMessageRouter } from "features/message"
import { socketUserRouter } from "features/user"
import { SocketInstanceType } from "shared-config"

const featureRouters = [socketUserRouter, socketChatRoomRouter, socketContactRouter, socketMessageRouter]

export const socketRouter = (socket: SocketInstanceType) => {
  featureRouters.forEach((router) => router(socket))
}
