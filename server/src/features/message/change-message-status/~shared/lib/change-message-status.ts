import type { IEventUpdateMessageStatus, MessageStatusType, SocketActionsType } from 'common'

import { getSocketsByUserIds } from 'features/user'

import { ChatRoomModel } from 'entities/chat-room'
import { MessageModel } from 'entities/message'

import { getIO } from 'shared-lib'

export const changeMessageStatus = async (
  messageId: string,
  status: MessageStatusType,
  userId: string,
  roomId: string
) => {
  const message = await MessageModel.findOneAndUpdate(
    { _id: messageId, 'usersMetaData.id': userId },
    { $set: { 'usersMetaData.$.status': status } }
  )
  if (!message) return

  const room = await ChatRoomModel.findOne({ _id: roomId })
  if (!room) return

  const sockets = await getSocketsByUserIds(room.users)

  const payload: IEventUpdateMessageStatus = {
    roomId,
    messageId,
    status
  }

  sockets.forEach((socketId: string) => {
    getIO().to(socketId).emit<SocketActionsType>('message-status-updated', payload)
  })
}
