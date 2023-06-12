import { ChatRoomModel } from '../../models/chatRoom.model'
import { UserModel } from '../../models/user.model'
import { io } from '../../server'
import { Message, SocketActions } from '../../../../types'

export const setMessage = async (data: { roomId: string; message: Message }) => {
  const message = { ...data.message, status: 'delivered' }

  await ChatRoomModel.findOneAndUpdate({ _id: data.roomId }, { $push: { messages: message } }, { new: true })

  const users = await UserModel.find({ 'chatRooms.roomId': data.roomId }, 'socketId')
  users.forEach(async (user) => {
    const updatedMessage = {
      ...message,
      isSelf: user.id === data.message.author
    }
    await UserModel.updateOne(
      { _id: user.id, 'chatRooms.roomId': data.roomId },
      { $push: { 'chatRooms.$.messages': message }, $set: { 'chatRooms.$.blocked': false } }
    )
    io.to(user.socketId).emit(SocketActions.MESSAGE_DELIVERED, { roomId: data.roomId, message: updatedMessage })
  })
}

export default setMessage
