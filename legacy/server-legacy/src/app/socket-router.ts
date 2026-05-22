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
import { changeMessageStatusController, loadRoomMessagesController, sendMessageController } from 'src/modules/message'
import {
  actualizeUserDataController,
  updateLanguageController,
  userConnectController,
  userDisconnectController
} from 'src/modules/user'

import { SocketInstance } from 'src/shared/config'

const socketControllers = [
  userConnectController,
  userDisconnectController,
  updateLanguageController,
  actualizeUserDataController,
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

export const socketRouter = (socket: SocketInstance) => {
  socketControllers.forEach((controller) => controller(socket))
}
