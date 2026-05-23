import {
  type CreateRoomAckPayload,
  type EventCreateRoom,
  type EventDeleteChatRoom,
  type EventLeaveChatRoom,
  type EventUpdateChatRoom,
  type EventUpdateMutedChatRoom,
  type EventUpdatePinnedChatRoom,
  type EventUpdatePinnedChatRoomOrder,
  type SocketActions
} from 'global-shared'

import type { PresenceService } from 'src/modules/presence/presence.service'
import { socketAckMiddleware } from 'src/shared/lib/socket-error'
import type { SocketInstance } from 'src/shared/types/socket'

import { CHAT_ROOMS_I18N } from './chat-rooms.i18n'
import {
  createChatRoom,
  deleteChatRoom,
  leaveChatRoom,
  updateChatRoom,
  updateMutedChatRoom,
  updatePinnedChatRoom,
  updatePinnedChatRoomOrder
} from './chat-rooms.service'

export const registerChatRoomsSocketHandlers = (socket: SocketInstance, presenceService: PresenceService) => {
  socket.on<SocketActions>(
    'create-chat-room',
    socketAckMiddleware<EventCreateRoom, CreateRoomAckPayload>(
      socket,
      async (payload) => {
        const responsePayload = await createChatRoom(socket.data.userId, payload, presenceService)

        return {
          ok: true,
          payload: responsePayload
        }
      },
      { basicError: CHAT_ROOMS_I18N.createChatRoomFailed }
    )
  )

  socket.on<SocketActions>(
    'update-chat-room',
    socketAckMiddleware<EventUpdateChatRoom>(
      socket,
      async (payload) => {
        await updateChatRoom(socket.data.userId, payload, presenceService)
      },
      { basicError: CHAT_ROOMS_I18N.updateChatRoomFailed }
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

  socket.on<SocketActions>(
    'update-muted-chat-room',
    socketAckMiddleware<EventUpdateMutedChatRoom>(
      socket,
      async (payload) => {
        await updateMutedChatRoom(socket.data.userId, payload)
      },
      { basicError: CHAT_ROOMS_I18N.updateMutedChatRoomFailed }
    )
  )
}
