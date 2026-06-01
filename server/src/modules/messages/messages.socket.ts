import { Injectable } from '@nestjs/common'
import type {
  EventAddReaction,
  EventChangeMessageStatus,
  EventDeleteMessage,
  EventEditMessage,
  EventLoadRoomMessages,
  EventMarkRoomAsRead,
  EventRoomMessagesLoaded,
  EventSendMessage,
  EventUpdatePinnedMessage,
  EventUserTyping
} from 'global-shared'

import { socketAckMiddleware, socketErrorMiddleware } from 'src/shared/lib/socket-error'
import type { SocketInstance } from 'src/shared/types'

import { MESSAGES_I18N } from './messages.i18n'
import {
  changeMessageStatus,
  deleteMessage,
  editMessage,
  emitRoomTypingStatus,
  loadRoomMessages,
  markRoomAsRead,
  sendMessage,
  toggleMessageReaction,
  updatePinnedMessage
} from './messages.service'

@Injectable()
export class MessagesSocketService {
  register(socket: SocketInstance) {
    socket.on(
      'send-message',
      socketErrorMiddleware<EventSendMessage>(
        socket,
        async ({ roomId, message }) => {
          await sendMessage({
            roomId,
            userId: socket.data.userId,
            message
          })
        },
        { basicError: MESSAGES_I18N.sendMessageFailed }
      )
    )

    socket.on(
      'edit-message',
      socketAckMiddleware<EventEditMessage>(
        socket,
        async (payload) => {
          await editMessage(socket.data.userId, payload)
        },
        { basicError: MESSAGES_I18N.editMessageFailed }
      )
    )

    socket.on(
      'load-room-messages',
      socketAckMiddleware<EventLoadRoomMessages, EventRoomMessagesLoaded>(
        socket,
        async (payload) => {
          const roomMessagesData = await loadRoomMessages(socket.data.userId, payload)

          if (!roomMessagesData) {
            return { ok: false }
          }

          return {
            ok: true,
            payload: roomMessagesData
          }
        },
        { basicError: MESSAGES_I18N.loadRoomMessagesFailed }
      )
    )

    socket.on(
      'client-typing',
      socketErrorMiddleware<EventUserTyping>(
        socket,
        async (payload) => {
          await emitRoomTypingStatus(socket.data.userId, payload)
        },
        { basicError: MESSAGES_I18N.updateTypingStatusFailed }
      )
    )

    socket.on(
      'update-pinned-message',
      socketAckMiddleware<EventUpdatePinnedMessage>(
        socket,
        async (payload) => {
          await updatePinnedMessage(socket.data.userId, payload)
        },
        { basicError: MESSAGES_I18N.updatePinnedMessageFailed }
      )
    )

    socket.on(
      'change-message-status',
      socketErrorMiddleware<EventChangeMessageStatus>(
        socket,
        async ({ messageId, status, roomId }) => {
          await changeMessageStatus(messageId, status, socket.data.userId, roomId)
        },
        { basicError: MESSAGES_I18N.changeMessageStatusFailed }
      )
    )

    socket.on(
      'mark-room-as-read',
      socketAckMiddleware<EventMarkRoomAsRead>(
        socket,
        async ({ roomId }) => {
          await markRoomAsRead(roomId, socket.data.userId)
        },
        { basicError: MESSAGES_I18N.markRoomAsReadFailed }
      )
    )

    socket.on(
      'delete-message',
      socketAckMiddleware<EventDeleteMessage>(
        socket,
        async (payload) => {
          await deleteMessage(socket.data.userId, payload)
        },
        { basicError: MESSAGES_I18N.deleteMessageFailed }
      )
    )

    socket.on(
      'add-reaction',
      socketAckMiddleware<EventAddReaction>(
        socket,
        async (payload) => {
          await toggleMessageReaction(socket.data.userId, payload)
        },
        { basicError: MESSAGES_I18N.updateMessageReactionFailed }
      )
    )
  }
}
