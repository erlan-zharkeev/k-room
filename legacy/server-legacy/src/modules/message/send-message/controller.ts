import { EventMessageDelivered, EventSendMessage, IMessage, SocketActions } from 'common'
import { v4 as uuidv4 } from 'uuid'

import { mediaBuckets, MongooseGridFSBucket, uploadBufferToBucket } from 'src/media'

import { ChatRoomModel } from 'src/modules/chat-room'
import { getSocketsByUserIds } from 'src/modules/user'
import { UserModel } from 'src/modules/user'

import { SharpSettingsKey, SocketInstance } from 'src/shared/config'
import { getIO } from 'src/shared/lib/io'
import { socketErrorMiddleware } from 'src/shared/middleware/socket-error-middleware'

import { MESSAGE_I18N } from '../i18n'
import { MessageModel } from '../message.model'

export const sendMessageController = (socket: SocketInstance) => {
  socket.on<SocketActions>(
    'send-message',
    socketErrorMiddleware(
      socket,
      async (data: EventSendMessage) => {
        const { message, roomId } = data
        const filenames: string[] = []
        const bucket = mediaBuckets.image as MongooseGridFSBucket
        await Promise.all(
          (message.images ?? []).map(async (imageData) => {
            if (imageData.fileBuffer) {
              const filename = `image.${uuidv4()}`
              filenames.push(filename)
              const compression: SharpSettingsKey = message.imageCompression
                ? 'common-compressed'
                : 'common-uncompressed'
              await uploadBufferToBucket(bucket, imageData.fileBuffer, filename, 'image', socket.data.language, {
                compression
              })
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

            const payload: EventMessageDelivered = {
              roomId,
              message: messageForUser
            }

            sockets.forEach((socketId) => {
              getIO().to(socketId).emit<SocketActions>('message-delivered', payload)
            })
          })
        )
      },
      { basicError: MESSAGE_I18N.sendMessageFailed }
    )
  )
}
