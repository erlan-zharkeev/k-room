import { SocketInstanceType } from 'shared-config'

import { controller as answerCallController } from './answer-call'
import { controller as callUserController } from './call-user'
import { controller as endCallController } from './end-call'
import { controller as loadCallDataController } from './load-call-data'
import { controller as markCallAsVideoController } from './mark-call-as-video'
import { controller as updateCallSignalController } from './update-call-signal'

const controllers = [
  loadCallDataController,
  markCallAsVideoController,
  callUserController,
  updateCallSignalController,
  answerCallController,
  endCallController
]

export const socketCallRouter = (socket: SocketInstanceType) => {
  controllers.forEach((controller) => controller(socket))
}
