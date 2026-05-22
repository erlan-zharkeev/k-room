import { EventChangeMessageStatus, SocketActions } from 'common'

import { SocketInstance } from 'src/shared/config'
import { socketErrorMiddleware } from 'src/shared/middleware/socket-error-middleware'

import { MESSAGE_I18N } from '../i18n'

import { changeMessageStatus } from './shared/lib/change-message-status'

export const changeMessageStatusController = (socket: SocketInstance) => {
  socket.on<SocketActions>(
    'change-message-status',
    socketErrorMiddleware(
      socket,
      async ({ messageId, status, roomId }: EventChangeMessageStatus) => {
        const { userId } = socket.data
        await changeMessageStatus(messageId, status, userId, roomId)
      },
      { basicError: MESSAGE_I18N.changeMessageStatusFailed }
    )
  )
}
