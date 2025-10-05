import { socketChatRoomRouter } from "features/chat-room"
import { socketContactRouter } from "features/contact"
import { SocketInstanceType } from "shared-config"

const featureRouters = [socketChatRoomRouter, socketContactRouter]

export const socketRouter = (socket: SocketInstanceType) => {
  featureRouters.forEach((router) => router(socket))
}