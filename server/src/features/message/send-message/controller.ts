import { v4 as uuidv4 } from 'uuid'

import { IEventMessageDelivered, IEventSendMessage, IMessage, SocketActionsType } from 'common'

import { getSocketsByUserIds } from 'src/features/user'

import { ChatRoomModel } from 'src/entities/chat-room'
import { mediaBuckets, MongooseGridFSBucketType, uploadBufferToBucket } from 'src/entities/media'
import { MessageModel } from 'src/entities/message'
import { UserModel } from 'src/entities/user'

import { SharpSettingsKeyType, SocketInstanceType } from 'src/shared/config'
import { getIO, serverCaptureSentryException } from 'src/shared/lib'

export const controller = (socket: SocketInstanceType) => {
  socket.on<SocketActionsType>('send-message', async (data: IEventSendMessage) => {
    try {
      const { message, roomId } = data
      const filenames: string[] = []
      const bucket = mediaBuckets.image as MongooseGridFSBucketType
      await Promise.all(
        (message.images ?? []).map(async (imageData) => {
          if (imageData.fileBuffer) {
            const filename = `image.${uuidv4()}`
            filenames.push(filename)
            const compression: SharpSettingsKeyType = message.imageCompression
              ? 'common-compressed'
              : 'common-uncompressed'
            await uploadBufferToBucket(bucket, imageData.fileBuffer, filename, 'image', undefined, { compression })
          }
        })
      )

      const messageForDb = {
        _id: message.id,
        reactions: [],
        ...message,
        images: filenames,
        usersMetaData: []
      }
      const newDbMessage = await new MessageModel(messageForDb).save()
      const room = await ChatRoomModel.findOneAndUpdate({ _id: roomId }, { $push: { messages: newDbMessage.id } })

      await Promise.all(
        (room?.users ?? []).map(async (userId) => {
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
      )
    } catch (error: unknown) {
      serverCaptureSentryException(error)
    }
  })
}
