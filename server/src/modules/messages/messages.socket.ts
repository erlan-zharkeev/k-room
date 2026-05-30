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
  EventUserTyping,
  SocketActions
} from 'global-shared'

import { socketAckMiddleware, socketErrorMiddleware } from 'src/shared/lib/socket-error'
import type { SocketInstance } from 'src/shared/types/socket'

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
    socket.on<SocketActions>(
      'send-message',
      socketErrorMiddleware(
        socket,
        async ({ roomId, message }: EventSendMessage) => {
          await sendMessage({
            roomId,
            userId: socket.data.userId,
            message
          })
        },
        { basicError: MESSAGES_I18N.sendMessageFailed }
      )
    )

    socket.on<SocketActions>(
      'edit-message',
      socketAckMiddleware<EventEditMessage>(
        socket,
        async (payload: EventEditMessage) => {
          await editMessage(socket.data.userId, payload)
        },
        { basicError: MESSAGES_I18N.editMessageFailed }
      )
    )

    socket.on<SocketActions>(
      'load-room-messages',
      socketAckMiddleware<EventLoadRoomMessages, EventRoomMessagesLoaded>(
        socket,
        async (payload: EventLoadRoomMessages) => {
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

    socket.on<SocketActions>(
      'client-typing',
      socketErrorMiddleware(
        socket,
        async (payload: EventUserTyping) => {
          await emitRoomTypingStatus(socket.data.userId, payload)
        },
        { basicError: MESSAGES_I18N.updateTypingStatusFailed }
      )
    )

    socket.on<SocketActions>(
      'update-pinned-message',
      socketAckMiddleware<EventUpdatePinnedMessage>(
        socket,
        async (payload: EventUpdatePinnedMessage) => {
          await updatePinnedMessage(socket.data.userId, payload)
        },
        { basicError: MESSAGES_I18N.updatePinnedMessageFailed }
      )
    )

    socket.on<SocketActions>(
      'change-message-status',
      socketErrorMiddleware(
        socket,
        async ({ messageId, status, roomId }: EventChangeMessageStatus) => {
          await changeMessageStatus(messageId, status, socket.data.userId, roomId)
        },
        { basicError: MESSAGES_I18N.changeMessageStatusFailed }
      )
    )

    socket.on<SocketActions>(
      'mark-room-as-read',
      socketAckMiddleware<EventMarkRoomAsRead>(
        socket,
        async ({ roomId }) => {
          await markRoomAsRead(roomId, socket.data.userId)
        },
        { basicError: MESSAGES_I18N.markRoomAsReadFailed }
      )
    )

    socket.on<SocketActions>(
      'delete-message',
      socketAckMiddleware<EventDeleteMessage>(
        socket,
        async (payload: EventDeleteMessage) => {
          await deleteMessage(socket.data.userId, payload)
        },
        { basicError: MESSAGES_I18N.deleteMessageFailed }
      )
    )

    socket.on<SocketActions>(
      'add-reaction',
      socketAckMiddleware<EventAddReaction>(
        socket,
        async (payload: EventAddReaction) => {
          await toggleMessageReaction(socket.data.userId, payload)
        },
        { basicError: MESSAGES_I18N.updateMessageReactionFailed }
      )
    )
  }
}
