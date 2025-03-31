import { ChatRoomModel, MessageModel } from '../../../models'
import { io } from '../../../server'
import { SocketActionsType, IImageObject, IMessage, IEventMessageDelivered, SharpSettingsKey } from '../../../@types'
import { saveImageAndGetPath } from '../../../utils'
import { getUserById } from '../getters'

export const setMessage = async ({ roomId, message }: { roomId: string; message: IMessage }) => {
  let images: IImageObject[] = []
  if (message.images) {
    const compressionType: SharpSettingsKey = message.imageCompression ? 'common-compressed' : 'common-uncompressed'
    const filesPromises = message.images?.map(async (image) => {
      return await saveImageAndGetPath(image.fileBuffer, compressionType, message.authorId)
    })
    const links = await Promise.all(filesPromises)
    images = links.map((value) => {
      return { src: value, name: value.split('img=')[1] }
    })
  }
  const room = await ChatRoomModel.findOne({ _id: roomId })
  const messageForDb = {
    reactions: [],
    ...message,
    images,
    usersMetaData: []
  }
  const newDbMessage = await new MessageModel(messageForDb).save()
  await ChatRoomModel.updateOne({ _id: roomId }, { $push: { messages: newDbMessage.id } })

  room?.users.forEach(async (userId) => {
    await MessageModel.updateOne(
      { _id: newDbMessage.id },
      { $push: { usersMetaData: { id: userId, status: 'delivered' } } }
    )
    const user = await getUserById(userId)
    if (!user?.socketId) return
    const messageForUser: IMessage = {
      ...message,
      images,
      id: String(newDbMessage._id),
      isSelf: user?.id === message.authorId,
      status: 'delivered'
    }
    const payload: IEventMessageDelivered = {
      roomId,
      message: messageForUser
    }
    io.to(user?.socketId).emit<SocketActionsType>('message-delivered', payload)
  })
}
