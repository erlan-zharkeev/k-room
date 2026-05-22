import { setTimeout as delay } from 'timers/promises'

import {
  CHAT_KIND,
  type ChatRoomSchemaType,
  type ICreateRoomAckPayload,
  type IEventCreateRoom,
  type IEventDeleteChatRoom,
  type IEventLeaveChatRoom,
  type IEventUpdatePinnedChatRoom,
  type IEventUpdatePinnedChatRoomOrder,
  MEDIA_AVATAR_FILENAME_PREFIX,
  type SocketActionsType
} from 'global-shared'

import type { PresenceService } from 'src/modules/presence/presence.service'
import { socketAckMiddleware } from 'src/shared/lib/socket-error'
import type { SocketInstanceType } from 'src/shared/types/socket'

import { uploadBufferToBucket } from '../media/media.service'

import { ROOM_CREATED_EVENT_DELAY_MS } from './chat-rooms.constants'
import { CHAT_ROOMS_I18N } from './chat-rooms.i18n'
import { ChatRoomModel } from './chat-rooms.model'
import {
  checkContactsExistence,
  deleteChatRoom,
  emitNewRoomToUsers,
  leaveChatRoom,
  setRoomToUsers,
  updatePinnedChatRoom,
  updatePinnedChatRoomOrder
} from './chat-rooms.service'

export const registerChatRoomsSocketHandlers = (socket: SocketInstanceType, presenceService: PresenceService) => {
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
        const roomData: Omit<ChatRoomSchemaType, 'id'> = {
          users,
          adminId: userId,
          createdAt: Date.now(),
          chatKind: contactIds.length > 1 ? CHAT_KIND.GROUP : CHAT_KIND.DIRECT,
          messages: []
        }

        if (chatName) {
          roomData.chatName = chatName
        }

        const room = new ChatRoomModel(roomData)
        const roomId = String(room._id)

        if (roomData.chatKind === CHAT_KIND.GROUP && avatarFile?.fileBuffer) {
          await uploadBufferToBucket(avatarFile.fileBuffer, `${MEDIA_AVATAR_FILENAME_PREFIX}${roomId}`, 'avatar', {
            compression: 'avatar',
            overwrite: true
          })
        }

        await room.save()
        await setRoomToUsers(roomId, users)
        await emitNewRoomToUsers(users, room.toObject(), presenceService)
        await delay(ROOM_CREATED_EVENT_DELAY_MS)

        return {
          ok: true,
          payload: { roomId }
        }
      },
      { basicError: CHAT_ROOMS_I18N.createChatRoomFailed }
    )
  )

  socket.on<SocketActionsType>(
    'delete-chat-room',
    socketAckMiddleware<IEventDeleteChatRoom>(
      socket,
      async (payload) => {
        await deleteChatRoom(socket.data.userId, payload)
      },
      { basicError: CHAT_ROOMS_I18N.deleteChatRoomFailed }
    )
  )

  socket.on<SocketActionsType>(
    'leave-chat-room',
    socketAckMiddleware<IEventLeaveChatRoom>(
      socket,
      async (payload) => {
        await leaveChatRoom(socket.data.userId, payload, presenceService)
      },
      { basicError: CHAT_ROOMS_I18N.leaveChatRoomFailed }
    )
  )

  socket.on<SocketActionsType>(
    'update-pinned-chat-room',
    socketAckMiddleware<IEventUpdatePinnedChatRoom>(
      socket,
      async (payload) => {
        await updatePinnedChatRoom(socket.data.userId, payload)
      },
      { basicError: CHAT_ROOMS_I18N.updatePinnedChatRoomFailed }
    )
  )

  socket.on<SocketActionsType>(
    'update-pinned-chat-room-order',
    socketAckMiddleware<IEventUpdatePinnedChatRoomOrder>(
      socket,
      async (payload) => {
        await updatePinnedChatRoomOrder(socket.data.userId, payload)
      },
      { basicError: CHAT_ROOMS_I18N.updatePinnedChatRoomFailed }
    )
  )
}
