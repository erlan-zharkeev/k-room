import { ChatRoomModel } from '../../models/chatRoom.model'
import { UserModel } from '../../models/user.model'
import { io } from '../../server'
import { MessageStatus, SocketActions } from '../../../../types'

const updateMessageStatus = async (
  roomId: string,
  userId: string,
  socketId: string,
  messageId: string,
  status: string
) => {
  await UserModel.findOneAndUpdate(
    { _id: userId, 'chatRooms.roomId': roomId },
    { $set: { 'chatRooms.$.messages.$[outer].status': status } },
    {
      arrayFilters: [{ 'outer.id': messageId }]
    }
  )
  io.to(socketId).emit(SocketActions.UPDATE_MESSAGE_STATUS, { roomId, messageId, status })
}

export const setMessageStatus = async (
  roomId: string,
  messageId: string,
  status: MessageStatus,
  userId: string,
  multiple: boolean
) => {
  const users = await UserModel.find({ 'chatRooms.roomId': roomId }, 'socketId')

  if (multiple) {
    const user = users.find((user) => user.id === userId)
    if (!user) return
    updateMessageStatus(roomId, user.id, user.socketId, messageId, status)
    return
  }

  await ChatRoomModel.findOneAndUpdate(
    {
      _id: roomId,
      messages: {
        $elemMatch: {
          id: messageId
        }
      }
    },
    {
      $set: {
        'messages.$[outer].status': status
      }
    },
    {
      new: true,
      arrayFilters: [{ 'outer.id': messageId }]
    }
  )

  users.forEach((user) => {
    updateMessageStatus(roomId, user.id, user.socketId, messageId, status)
  })
}

export default setMessageStatus
