import type {
  IEventChangeMessageStatus,
  IEventLoadRoomMessages,
  IEventSendMessage,
  SocketActionsType
} from 'global-shared'

import { getIO } from 'src/shared/lib/io'
import { socketErrorMiddleware } from 'src/shared/lib/socket-error'
import type { SocketInstanceType } from 'src/shared/types/socket'

import { MESSAGES_I18N } from './messages.i18n'
import { changeMessageStatus, loadRoomMessages, sendMessage } from './messages.service'

export const registerMessagesSocketHandlers = (socket: SocketInstanceType) => {
  socket.on<SocketActionsType>(
    'send-message',
    socketErrorMiddleware(
      socket,
      async ({ roomId, message }: IEventSendMessage) => {
        await sendMessage({
          roomId,
          message,
          language: socket.data.language
        })
      },
      { basicError: MESSAGES_I18N.sendMessageFailed }
    )
  )

  socket.on<SocketActionsType>(
    'load-room-messages',
    socketErrorMiddleware(
      socket,
      async (payload: IEventLoadRoomMessages) => {
        const roomMessagesData = await loadRoomMessages(socket.data.userId, payload)

        if (!roomMessagesData) {
          return
        }

        getIO().to(socket.id).emit<SocketActionsType>('room-messages-loaded', roomMessagesData)
      },
      { basicError: MESSAGES_I18N.loadRoomMessagesFailed }
    )
  )

  socket.on<SocketActionsType>(
    'change-message-status',
    socketErrorMiddleware(
      socket,
      async ({ messageId, status, roomId }: IEventChangeMessageStatus) => {
        await changeMessageStatus(messageId, status, socket.data.userId, roomId)
      },
      { basicError: MESSAGES_I18N.changeMessageStatusFailed }
    )
  )
}
