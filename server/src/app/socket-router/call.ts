import {
  answerCallController,
  callUserController,
  endCallController,
  loadCallDataController,
  markCallAsVideoController,
  updateCallSignalController
} from 'src/features/call'

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
