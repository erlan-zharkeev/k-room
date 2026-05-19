import { setTimeout as delay } from 'timers/promises'

import {
  CHAT_KIND,
  type IChatRoomSchema,
  type ICreateRoomAckPayload,
  type IEventCreateRoom,
  type SocketActionsType
} from 'global-shared'

import { socketAckMiddleware } from 'src/shared/lib/socket-error'
import type { SocketInstanceType } from 'src/shared/types/socket'

import { uploadBufferToBucket } from '../media/media.service'

import { ROOM_CREATED_EVENT_DELAY_MS } from './chat-rooms.constants'
import { CHAT_ROOMS_I18N } from './chat-rooms.i18n'
import { ChatRoomModel } from './chat-rooms.model'
import { checkContactsExistence, emitNewRoomToUsers, setRoomToUsers } from './chat-rooms.service'

export const registerChatRoomsSocketHandlers = (socket: SocketInstanceType) => {
  socket.on<SocketActionsType>(
    'create-chat-room',
    socketAckMiddleware<IEventCreateRoom, ICreateRoomAckPayload>(
      socket,
      async ({ contactIds, chatName, avatarFile }) => {
        const { userId } = socket.data
        const usersAccepted = await checkContactsExistence(userId, contactIds)

        if (!usersAccepted) {
          return
        }

        const users = [userId, ...contactIds]
        const roomData: Omit<IChatRoomSchema, 'id'> = {
          users,
          authorId: userId,
          chatKind: contactIds.length > 1 ? CHAT_KIND.GROUP : CHAT_KIND.DIRECT,
          messages: []
        }

        if (chatName) {
          roomData.chatName = chatName
        }

        const room = new ChatRoomModel(roomData)
        const roomId = String(room._id)

        if (roomData.chatKind === CHAT_KIND.GROUP && avatarFile?.fileBuffer) {
          await uploadBufferToBucket(avatarFile.fileBuffer, `avatar.${roomId}`, 'avatar', {
            compression: 'avatar',
            overwrite: true
          })
        }

        await room.save()
        await setRoomToUsers(roomId, users)
        await emitNewRoomToUsers(users, room.toObject())
        await delay(ROOM_CREATED_EVENT_DELAY_MS)

        return {
          ok: true,
          payload: { roomId }
        }
      },
      { basicError: CHAT_ROOMS_I18N.createChatRoomFailed }
    )
  )
}
