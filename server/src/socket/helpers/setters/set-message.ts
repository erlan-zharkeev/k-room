import { ChatRoomModel, MessageModel } from '../../../models'
import { io } from '../../../server'
import {
  Message,
  SharpSettingsKey,
  DBChatRoom,
  MessageStatus,
  SocketActionsPayload,
  SocketActions
} from '../../../@types'
import { saveImageAndGetPath } from '../../../utils'
import { getUserById } from '../getters'

export const setMessage = async ({ roomId, message }: { roomId: string; message: Message }) => {
  let images: { src: string; name: string }[] = []
  if (message.images) {
    const compressionType = message.imageCompression
      ? SharpSettingsKey.commonCompressed
      : SharpSettingsKey.commonUncompressed
    const filesPromises = message.images?.map(async (image) => {
      return await saveImageAndGetPath(image.fileBuffer, compressionType, message.authorId)
    })
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
