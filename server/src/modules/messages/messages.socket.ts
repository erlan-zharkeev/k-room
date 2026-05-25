import type {
  EventChangeMessageStatus,
  EventLoadRoomMessages,
  EventMarkRoomAsRead,
  EventRoomMessagesLoaded,
  EventSendMessage,
  EventUserTyping,
  SocketActions
} from 'global-shared'

import { socketAckMiddleware, socketErrorMiddleware } from 'src/shared/lib/socket-error'
import type { SocketInstance } from 'src/shared/types/socket'

import { MESSAGES_I18N } from './messages.i18n'
import {
  changeMessageStatus,
  emitRoomTypingStatus,
  loadRoomMessages,
  markRoomAsRead,
  sendMessage
} from './messages.service'

export const registerMessagesSocketHandlers = (socket: SocketInstance) => {
  socket.on<SocketActions>(
    'send-message',
    socketErrorMiddleware(
      socket,
      async ({ roomId, message }: EventSendMessage) => {
        await sendMessage({
          roomId,
          message
        })
      },
      { basicError: MESSAGES_I18N.sendMessageFailed }
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
}
