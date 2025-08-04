import { MessageModel, ChatRoomModel } from '../../../models'
import { io } from '../../../app/server'
import type { IEventUpdateMessageStatus, MessageStatusType, SocketActionsType } from 'common-types'
import { getUserById, getSocketsByUserIds } from '../getters'

export const setMessageStatus = async (
  messageId: string,
  status: MessageStatusType,
  userId: string,
  roomId: string
) => {
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

  const payload: IEventUpdateMessageStatus = {
    roomId,
    messageId,
    status
  }
  userSockets.forEach((socketId) => {
    io.to(socketId).emit<SocketActionsType>('message-status-updated', payload)
  })
}
