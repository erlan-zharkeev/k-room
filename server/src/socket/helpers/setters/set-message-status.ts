import { MessageModel, ChatRoomModel } from '../../../models'
import { io } from '../../../server'
import { MessageStatus, SocketActionsPayload, SocketActions } from '../../../@types'
import { getUserById, getSocketsByUserIds } from '../getters'

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
