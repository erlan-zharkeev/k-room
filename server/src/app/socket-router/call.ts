import { controller as answerCallController } from 'src/features/call/answer-call'
import { controller as callUserController } from 'src/features/call/call-user'
import { controller as endCallController } from 'src/features/call/end-call'
import { controller as loadCallDataController } from 'src/features/call/load-call-data'
import { controller as markCallAsVideoController } from 'src/features/call/mark-call-as-video'
import { controller as updateCallSignalController } from 'src/features/call/update-call-signal'
import { SocketInstanceType } from 'src/shared/config'

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
