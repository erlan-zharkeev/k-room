import { ChatRoomModel } from '../../../models/chatRoom.model'
import { io } from '../../../server'
import { DBChatRoom, Message, MessageStatus, SocketActions, SocketActionsPayload } from '../../../../../types'
import { saveImageAndGetPath } from '../../../utils/saveImageAndGetPath'
import { SharpSettingsKey } from '../../../types/Constants'
import { MessageModel } from '../../../models/message.model'
import { getUserById } from '../getters/getUserById'

export const setMessage = async ({ roomId, message }: { roomId: string; message: Message }) => {
  let images: { src: string; name: string }[] = []
  if (message.images) {
    const compressionType = message.imageCompression
      ? SharpSettingsKey.commonCompressed
      : SharpSettingsKey.commonUncompressed
    const filesPromises = message.images?.map((image) =>
      saveImageAndGetPath(image.fileBuffer, compressionType, message.authorId)
    )
    const links = await Promise.all(filesPromises)
    images = links.map((value) => {
      return { src: value, name: value.split('img=')[1] }
    })
  }
  const room = (await ChatRoomModel.findOne({ _id: roomId })) as DBChatRoom
  const messageForDb = {
    reactions: [],
    ...message,
    images,
    usersMetaData: []
  }
  const newDbMessage = await new MessageModel(messageForDb).save()
  await ChatRoomModel.updateOne({ _id: roomId }, { $push: { messages: newDbMessage.id }, $set: { blocked: false } })
  room?.users.forEach(async (userId) => {
    await MessageModel.updateOne(
      { _id: newDbMessage.id },
      { $push: { usersMetaData: { id: userId, status: MessageStatus.delivered } } }
    )
    const user = await getUserById(userId)
    if (!user?.socketId) return
    const messageForUser = {
      ...message,
      images,
      id: String(newDbMessage._id),
      isSelf: user?.id === message.authorId,
      status: MessageStatus.delivered
    }
    const payload: SocketActionsPayload['messageDelivered'] = {
      roomId,
      message: messageForUser
    }
    io.to(user?.socketId).emit(SocketActions.MESSAGE_DELIVERED, payload)
  })
}

export default setMessage
