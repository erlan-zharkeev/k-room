import { setTimeout } from 'timers/promises'

import { IChatRoomSchema, IEventCreateRoom, IEventRoomCreated, SocketActionsType } from 'common'

import { getSocketsByUserIds } from 'src/features/user'

import { ChatRoomModel } from 'src/entities/chat-room'
import { mediaBuckets, MongooseGridFSBucketType, uploadBufferToBucket } from 'src/entities/media'

import { SocketInstanceType } from 'src/shared/config'
import { getIO } from 'src/shared/lib'
import { socketErrorMiddleware } from 'src/shared/middleware'

import { CHAT_ROOM_I18N } from './../config'
import { checkContactsExistence, emitNewRoomToUsers, setRoomToUsers } from './../shared'

export const createChatRoomController = (socket: SocketInstanceType) => {
  socket.on<SocketActionsType>(
    'create-chat-room',
    socketErrorMiddleware(
      socket,
      async ({ contactIds, chatName, avatarFile }: IEventCreateRoom) => {
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
          const bucket = mediaBuckets.avatar as MongooseGridFSBucketType
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
          getIO().to(socketId).emit<SocketActionsType>('room-created', payload)
        })
      },
      { basicError: CHAT_ROOM_I18N.createChatRoomFailed }
    )
  )
}
