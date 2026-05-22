import { setTimeout as delay } from 'timers/promises'

import {
  CHAT_KIND,
  type ChatRoomSchema,
  type CreateRoomAckPayload,
  type EventCreateRoom,
  type EventDeleteChatRoom,
  type EventLeaveChatRoom,
  type EventUpdatePinnedChatRoom,
  type EventUpdatePinnedChatRoomOrder,
  MEDIA_AVATAR_FILENAME_PREFIX,
  type SocketActions
} from 'global-shared'

import type { PresenceService } from 'src/modules/presence/presence.service'
import { socketAckMiddleware } from 'src/shared/lib/socket-error'
import type { SocketInstance } from 'src/shared/types/socket'

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
  updatePinnedChatRoomOrder,
  validateCreateChatRoomLimits
} from './chat-rooms.service'

export const registerChatRoomsSocketHandlers = (socket: SocketInstance, presenceService: PresenceService) => {
  socket.on<SocketActions>(
    'create-chat-room',
    socketAckMiddleware<EventCreateRoom, CreateRoomAckPayload>(
      socket,
      async ({ contactIds, chatName, avatarFile }) => {
        const { userId } = socket.data
        const users = [userId, ...contactIds]
        await validateCreateChatRoomLimits(users, chatName)

        const usersAccepted = await checkContactsExistence(userId, contactIds)

        if (!usersAccepted) {
          return
        }

        const roomData: Omit<ChatRoomSchema, 'id'> = {
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

  socket.on<SocketActions>(
    'delete-chat-room',
    socketAckMiddleware<EventDeleteChatRoom>(
      socket,
      async (payload) => {
        await deleteChatRoom(socket.data.userId, payload)
      },
      { basicError: CHAT_ROOMS_I18N.deleteChatRoomFailed }
    )
  )

  socket.on<SocketActions>(
    'leave-chat-room',
    socketAckMiddleware<EventLeaveChatRoom>(
      socket,
      async (payload) => {
        await leaveChatRoom(socket.data.userId, payload, presenceService)
      },
      { basicError: CHAT_ROOMS_I18N.leaveChatRoomFailed }
    )
  )

  socket.on<SocketActions>(
    'update-pinned-chat-room',
    socketAckMiddleware<EventUpdatePinnedChatRoom>(
      socket,
      async (payload) => {
        await updatePinnedChatRoom(socket.data.userId, payload)
      },
      { basicError: CHAT_ROOMS_I18N.updatePinnedChatRoomFailed }
    )
  )

  socket.on<SocketActions>(
    'update-pinned-chat-room-order',
    socketAckMiddleware<EventUpdatePinnedChatRoomOrder>(
      socket,
      async (payload) => {
        await updatePinnedChatRoomOrder(socket.data.userId, payload)
      },
      { basicError: CHAT_ROOMS_I18N.updatePinnedChatRoomFailed }
    )
  )
}
