import { controller as answerCallController } from 'features/call/answer-call'
import { controller as callUserController } from 'features/call/call-user'
import { controller as endCallController } from 'features/call/end-call'
import { controller as loadCallDataController } from 'features/call/load-call-data'
import { controller as markCallAsVideoController } from 'features/call/mark-call-as-video'
import { controller as updateCallSignalController } from 'features/call/update-call-signal'

import { SocketInstanceType } from 'shared-config'

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
