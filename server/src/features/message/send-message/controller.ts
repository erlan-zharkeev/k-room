import { v4 as uuidv4 } from 'uuid'

import { IEventMessageDelivered, IEventSendMessage, IMessage, SocketActionsType } from 'common-types'

import { getSocketsByUserIds } from 'features/user'

import { ChatRoomModel } from 'entities/chat-room'
import { mediaBuckets, MongooseGridFSBucketType, uploadBufferToBucket } from 'entities/media'
import { MessageModel } from 'entities/message'
import { UserModel } from 'entities/user'

import { SharpSettingsKey, SocketInstanceType } from 'shared-config'
import { getIO } from 'shared-lib'

export const controller = (socket: SocketInstanceType) => {
  socket.on<SocketActionsType>('send-message', async (data: IEventSendMessage) => {
    try {
      const { message, roomId } = data
      const filenames: string[] = []
      const bucket = mediaBuckets.image as MongooseGridFSBucketType
      message.images?.forEach(async (imageData) => {
        if (imageData.fileBuffer) {
          const filename = `image.${uuidv4()}`
          filenames.push(filename)
          const compression: SharpSettingsKey = message.imageCompression ? 'common-compressed' : 'common-uncompressed'
          await uploadBufferToBucket(bucket, imageData.fileBuffer, filename, 'image', undefined, { compression })
        }
      })

      const messageForDb = {
        _id: message.id,
        reactions: [],
        ...message,
        images: filenames,
        usersMetaData: []
      }
      const newDbMessage = await new MessageModel(messageForDb).save()
      const room = await ChatRoomModel.findOneAndUpdate({ _id: roomId }, { $push: { messages: newDbMessage.id } })

      room?.users.forEach(async (userId) => {
        await MessageModel.updateOne(
          { _id: newDbMessage.id },
          { $push: { usersMetaData: { id: userId, status: 'delivered' } } }
        )
        const user = await UserModel.findById(userId)

        if (!user) return
        const sockets = await getSocketsByUserIds([user._id])
        if (!sockets.length) return

        const messageForUser: IMessage = {
          ...message,
          images: filenames.map((filename) => ({ src: filename, name: filename })),
          id: newDbMessage.id,
          isSelf: user?.id === message.authorId,
          status: 'delivered'
        }

        const payload: IEventMessageDelivered = {
          roomId,
          message: messageForUser
        }

        sockets.forEach((socketId) => {
          getIO().to(socketId).emit<SocketActionsType>('message-delivered', payload)
        })
      })
    } catch (e: unknown) {
      console.log(e)
    }
  })
}
