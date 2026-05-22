import { EventLoadRoomMessages, SocketActions } from 'common'

import { SocketInstance } from 'src/shared/config'
import { getIO } from 'src/shared/lib/io'
import { socketErrorMiddleware } from 'src/shared/middleware/socket-error-middleware'

import { MESSAGE_I18N } from '../i18n'

import { loadRoomMessages } from './shared/lib/load-room-messages'

export const loadRoomMessagesController = (socket: SocketInstance) => {
  socket.on<SocketActions>(
    'load-room-messages',
    socketErrorMiddleware(
      socket,
      async (payload: EventLoadRoomMessages) => {
        const { userId } = socket.data
        const roomMessagesData = await loadRoomMessages(userId, payload)

        if (!roomMessagesData) return

        getIO().to(socket.id).emit<SocketActions>('room-messages-loaded', roomMessagesData)
      },
      { basicError: MESSAGE_I18N.loadRoomMessagesFailed }
    )
  )
}
