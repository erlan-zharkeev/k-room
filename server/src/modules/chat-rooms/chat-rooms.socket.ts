import { Injectable } from '@nestjs/common'
import {
  type CreateRoomAckPayload,
  type EventCreateRoom,
  type EventDeleteChatRoom,
  type EventLeaveChatRoom,
  type EventUpdateChatRoom,
  type EventUpdateMutedChatRoom,
  type EventUpdatePinnedChatRoom,
  type EventUpdatePinnedChatRoomOrder
} from 'global-shared'

import { PresenceService } from 'src/modules/presence/presence.service'
import { socketAckMiddleware } from 'src/shared/lib/socket-error'
import type { SocketInstance } from 'src/shared/types'

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

@Injectable()
export class ChatRoomsSocketService {
  constructor(private readonly presenceService: PresenceService) {}

  register(socket: SocketInstance) {
    socket.on(
      'create-chat-room',
      socketAckMiddleware<EventCreateRoom, CreateRoomAckPayload>(
        socket,
        async (payload) => {
          const responsePayload = await createChatRoom(socket.data.userId, payload, this.presenceService)

          return {
            ok: true,
            payload: responsePayload
          }
        },
        { basicError: CHAT_ROOMS_I18N.createChatRoomFailed }
      )
    )

    socket.on(
      'update-chat-room',
      socketAckMiddleware<EventUpdateChatRoom>(
        socket,
        async (payload) => {
          await updateChatRoom(socket.data.userId, payload, this.presenceService)
        },
        { basicError: CHAT_ROOMS_I18N.updateChatRoomFailed }
      )
    )

    socket.on(
      'delete-chat-room',
      socketAckMiddleware<EventDeleteChatRoom>(
        socket,
        async (payload) => {
          await deleteChatRoom(socket.data.userId, payload)
        },
        { basicError: CHAT_ROOMS_I18N.deleteChatRoomFailed }
      )
    )

    socket.on(
      'leave-chat-room',
      socketAckMiddleware<EventLeaveChatRoom>(
        socket,
        async (payload) => {
          await leaveChatRoom(socket.data.userId, payload, this.presenceService)
        },
        { basicError: CHAT_ROOMS_I18N.leaveChatRoomFailed }
      )
    )

    socket.on(
      'update-pinned-chat-room',
      socketAckMiddleware<EventUpdatePinnedChatRoom>(
        socket,
        async (payload) => {
          await updatePinnedChatRoom(socket.data.userId, payload)
        },
        { basicError: CHAT_ROOMS_I18N.updatePinnedChatRoomFailed }
      )
    )

    socket.on(
      'update-pinned-chat-room-order',
      socketAckMiddleware<EventUpdatePinnedChatRoomOrder>(
        socket,
        async (payload) => {
          await updatePinnedChatRoomOrder(socket.data.userId, payload)
        },
        { basicError: CHAT_ROOMS_I18N.updatePinnedChatRoomFailed }
      )
    )

    socket.on(
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
}
