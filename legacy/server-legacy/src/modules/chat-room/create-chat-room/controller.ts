import { setTimeout } from 'timers/promises'

import { IChatRoomSchema, EventCreateRoom, IEventRoomCreated, SocketActions } from 'common'

import { mediaBuckets, MongooseGridFSBucket, uploadBufferToBucket } from 'src/media'

import { getSocketsByUserIds } from 'src/modules/user'

import { SocketInstance } from 'src/shared/config'
import { getIO } from 'src/shared/lib/io'
import { socketErrorMiddleware } from 'src/shared/middleware/socket-error-middleware'

import { ChatRoomModel } from '../chat-room.model'
import { CHAT_ROOM_I18N } from '../i18n'
import { checkContactsExistence } from '../shared/lib/check-contacts-existence'
import { emitNewRoomToUsers } from '../shared/lib/emit-new-room-to-users'
import { setRoomToUsers } from '../shared/lib/set-room-to-users'

export const createChatRoomController = (socket: SocketInstance) => {
  socket.on<SocketActions>(
    'create-chat-room',
    socketErrorMiddleware(
      socket,
      async ({ contactIds, chatName, avatarFile }: EventCreateRoom) => {
        const { userId } = socket.data

        const usersAccepted = checkContactsExistence(userId, contactIds)
        if (!usersAccepted) return
        const users: string[] = [userId, ...contactIds]
        const roomData: Omit<IChatRoomSchema, 'id'> = {
          users,
          authorId: userId,
          messages: []
        }
        if (avatarFile && avatarFile.fileBuffer) {
          const bucket = mediaBuckets.avatar as MongooseGridFSBucket
          const filename = `avatar.${String(userId)}`
          await uploadBufferToBucket(bucket, avatarFile.fileBuffer, filename, 'avatar', socket.data.language, {
            compression: 'avatar'
          })
        }
        if (chatName) {
          roomData.chatName = chatName
        }
        const room = new ChatRoomModel(roomData)
        const savedRoom = await room.save()
        await setRoomToUsers(savedRoom.id, users)
        await emitNewRoomToUsers(users, room)
        await setTimeout(1000)
        const sockets = await getSocketsByUserIds([userId])
        const payload: IEventRoomCreated = { roomId: savedRoom.id }
        sockets.forEach((socketId) => {
          getIO().to(socketId).emit<SocketActions>('room-created', payload)
        })
      },
      { basicError: CHAT_ROOM_I18N.createChatRoomFailed }
    )
  )
}
