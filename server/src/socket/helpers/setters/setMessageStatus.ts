import { ChatRoomModel } from '../../../models/chatRoom.model'
import { io } from '../../../server'
import { MessageStatus, SocketActions } from '../../../../../types'
import { getSocketsByUserIds } from '../getters'
import { getUserById } from '../getters/getUserById'
import { MessageModel } from '../../../models/message.model'

export const setMessageStatus = async (messageId: string, status: MessageStatus, userId: string, roomId: string) => {
  const user = await getUserById(userId)
  if (!user) return
  await MessageModel.findOneAndUpdate(
    { _id: messageId, 'usersMetaData._id': userId },
    { $set: { 'usersMetaData.$.status': status } }
  )
  const room = await ChatRoomModel.findOne({ _id: roomId })
  if (!room) return
  const userSockets = await getSocketsByUserIds(room?.users)
  userSockets.forEach((socketId) => {
    io.to(socketId).emit(SocketActions['update-message-status'], { roomId, messageId, status })
  })
}
