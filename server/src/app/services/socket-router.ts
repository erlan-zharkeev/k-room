import { socketContactRouter } from "features/contact"
import { SocketInstanceType } from "shared-config"

const featureRouters = [socketContactRouter]

export const socketRouter = (socket: SocketInstanceType) => {
  featureRouters.forEach((router) => router(socket))
}