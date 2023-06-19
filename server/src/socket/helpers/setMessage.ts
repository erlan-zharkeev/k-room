import { ChatRoomModel } from '../../models/chatRoom.model'
import { UserModel } from '../../models/user.model'
import { io } from '../../server'
import { Message, SocketActions } from '../../../../types'
import { saveAndGetImagePath } from './../../utils/saveAndGetImagePath'
import { SharpKey } from './../../types/Constants'

export const setMessage = async (data: { roomId: string; message: Message }) => {
  const message = { ...data.message, status: 'delivered' }

  await ChatRoomModel.findOneAndUpdate({ _id: data.roomId }, { $push: { messages: message } }, { new: true })

  let files: { src: string; name: string }[] = []
  if (message.files) {
    const compressionType = message.filesCompression ? SharpKey.commonCompressed : SharpKey.commonUncompressed
    const filesPromises = message.files?.map((file) => saveAndGetImagePath(file.fileBuffer, compressionType))
    const links = await Promise.all(filesPromises)
    files = links.map((value) => {
      return { src: value, name: value.split('img=')[1] }
    })
  }
  const users = await UserModel.find({ 'chatRooms.roomId': data.roomId }, 'socketId')
  users.forEach(async (user) => {
    const updatedMessage = {
      reactions: [],
      ...message,
      files,
      isSelf: user.id === data.message.author
    }
    await UserModel.updateOne(
      { _id: user.id, 'chatRooms.roomId': data.roomId },
      { $push: { 'chatRooms.$.messages': updatedMessage }, $set: { 'chatRooms.$.blocked': false } }
    )
    io.to(user.socketId).emit(SocketActions.MESSAGE_DELIVERED, { roomId: data.roomId, message: updatedMessage })
  })
}

export default setMessage
