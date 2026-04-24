import { setTimeout as delay } from 'timers/promises'

import type { IChatRoomSchema, IEventCreateRoom, SocketActionsType } from 'global-shared'

import { getIO } from 'src/shared/lib/io'
import { socketErrorMiddleware } from 'src/shared/lib/socket-error'
import type { SocketInstanceType } from 'src/shared/types/socket'

import { uploadBufferToBucket } from '../media/media.service'
import { getSocketsByUserIds } from '../user/user.service'

import { CHAT_ROOMS_I18N } from './chat-rooms.i18n'
import { ChatRoomModel } from './chat-rooms.model'
import { checkContactsExistence, emitNewRoomToUsers, setRoomToUsers } from './chat-rooms.service'

export const registerChatRoomsSocketHandlers = (socket: SocketInstanceType) => {
  socket.on<SocketActionsType>(
    'create-chat-room',
    socketErrorMiddleware(
      socket,
      async ({ contactIds, chatName, avatarFile }: IEventCreateRoom) => {
        const { userId, language } = socket.data
        const usersAccepted = await checkContactsExistence(userId, contactIds)

        if (!usersAccepted) {
          return
        }

        const users = [userId, ...contactIds]
        const roomData: Omit<IChatRoomSchema, 'id'> = {
          users,
          authorId: userId,
          messages: []
        }

        if (chatName) {
          roomData.chatName = chatName
        }

        if (avatarFile?.fileBuffer) {
          await uploadBufferToBucket(avatarFile.fileBuffer, `avatar.${userId}`, 'avatar', language, {
            compression: 'avatar',
            overwrite: true
          })
        }

        const room = await new ChatRoomModel(roomData).save()

        await setRoomToUsers(String(room._id), users)
        await emitNewRoomToUsers(users, room.toObject())
        await delay(1000)

        const sockets = await getSocketsByUserIds([userId])

        sockets.forEach((socketId) => {
          getIO()
            .to(socketId)
            .emit<SocketActionsType>('room-created', { roomId: String(room._id) })
        })
      },
      { basicError: CHAT_ROOMS_I18N.createChatRoomFailed }
    )
  )
}
