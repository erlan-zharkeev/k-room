import { setTimeout } from 'timers/promises'

import { IChatRoomSchema, IEventCreateRoom, IEventRoomCreated, SocketActionsType } from 'common-types'

import { checkContactsExistence, emitNewRoomToUsers, setRoomToUsers } from 'features/chat-room'
import { getSocketsByUserIds } from 'features/user'

import { ChatRoomModel } from 'entities/chat-room'
import { mediaBuckets, MongooseGridFSBucketType, uploadBufferToBucket } from 'entities/media'

import { SERVER_NOTIFICATION_MESSAGE, SocketInstanceType } from 'shared-config'
import { getIO, throwSocketError } from 'shared-lib'

export const controller = (socket: SocketInstanceType) => {
  socket.on<SocketActionsType>('create-chat-room', async ({ contactIds, chatName, avatarFile }: IEventCreateRoom) => {
    const { userId } = socket.data

    try {
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
        await uploadBufferToBucket(bucket, avatarFile.fileBuffer, filename, 'avatar', undefined, {
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
    } catch {
      throwSocketError(socket.id, SERVER_NOTIFICATION_MESSAGE.RoomCreationError)
    }
  })
}
