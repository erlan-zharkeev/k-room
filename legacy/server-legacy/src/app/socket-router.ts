import {
  answerCallController,
  callUserController,
  endCallController,
  loadCallDataController,
  markCallAsVideoController,
  updateCallSignalController
} from 'src/modules/call'
import { createChatRoomController } from 'src/modules/chat-room'
import {
  interlocutorPingController,
  saveContactController,
  searchContactController,
  updateContactInteractionTypeController
} from 'src/modules/contact'
import { markInfoNotificationAsReadController } from 'src/modules/info-notification'
import { changeMessageStatusController, loadRoomMessagesController, sendMessageController } from 'src/modules/message'
import {
  actualizeUserDataController,
  updateLanguageController,
  userConnectController,
  userDisconnectController
} from 'src/modules/user'

import { SocketInstanceType } from 'src/shared/config'

const socketControllers = [
  userConnectController,
  userDisconnectController,
  updateLanguageController,
  actualizeUserDataController,
  markInfoNotificationAsReadController,
  createChatRoomController,
  searchContactController,
  saveContactController,
  interlocutorPingController,
  updateContactInteractionTypeController,
  sendMessageController,
  changeMessageStatusController,
  loadRoomMessagesController,
  loadCallDataController,
  markCallAsVideoController,
  callUserController,
  updateCallSignalController,
  answerCallController,
  endCallController
]

export const socketRouter = (socket: SocketInstanceType) => {
  socketControllers.forEach((controller) => controller(socket))
}
