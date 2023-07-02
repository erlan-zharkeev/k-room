import { ChatRoomModel } from '../../../models/chatRoom.model'
import { io } from '../../../server'
import { MessageMetaData, MessageStatus, SocketActions, SocketActionsPayload } from '../../../../../types'
import { getSocketsByUserIds } from '../getters'
import { getUserById } from '../getters/getUserById'
import { MessageModel } from '../../../models/message.model'

export const setMessageStatus = async (messageId: string, status: MessageStatus, userId: string, roomId: string) => {
  const user = await getUserById(userId)
  if (!user) return
  const message = await MessageModel.findOneAndUpdate(
    { _id: messageId, 'usersMetaData.id': userId },
    { $set: { 'usersMetaData.$.status': status } }
  )
  if (!message) return
  const room = await ChatRoomModel.findOne({ _id: roomId })
  if (!room) return
  const userSockets = await getSocketsByUserIds(room?.users)

  const payload: SocketActionsPayload['updateMessageStatus'] = {
    roomId,
    messageId,
    status
  }
  userSockets.forEach((socketId) => {
    io.to(socketId).emit(SocketActions.UPDATE_MESSAGE_STATUS, payload)
  })
}
