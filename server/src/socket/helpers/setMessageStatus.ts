import { ChatRoomModel } from '../../models/chatRoom.model'
import { UserModel } from '../../models/user.model'
import { io } from '../../server'
import { MessageStatus, SocketActions } from '../../../../types'

export const setMessageStatus = async (roomId: string, messageId: string, status: MessageStatus) => {
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
  const users = await UserModel.find({ 'chatRooms.roomId': roomId }, 'socketId')
  users.forEach(async (user) => {
    await UserModel.findOneAndUpdate(
      { _id: user.id, 'chatRooms.roomId': roomId },
      { $set: { 'chatRooms.$.messages.$[outer].status': status } },
      {
        arrayFilters: [{ 'outer.id': messageId }]
      }
    )
    io.to(user.socketId).emit(SocketActions.UPDATE_MESSAGE_STATUS, { roomId, messageId, status })
  })
}

export default setMessageStatus
