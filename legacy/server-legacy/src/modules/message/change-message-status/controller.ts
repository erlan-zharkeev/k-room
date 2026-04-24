import { IEventChangeMessageStatus, SocketActionsType } from 'common'

import { SocketInstanceType } from 'src/shared/config'
import { socketErrorMiddleware } from 'src/shared/middleware/socket-error-middleware'

import { MESSAGE_I18N } from '../i18n'

import { changeMessageStatus } from './shared/lib/change-message-status'

export const changeMessageStatusController = (socket: SocketInstanceType) => {
  socket.on<SocketActionsType>(
    'change-message-status',
    socketErrorMiddleware(
      socket,
      async ({ messageId, status, roomId }: IEventChangeMessageStatus) => {
        const { userId } = socket.data
        await changeMessageStatus(messageId, status, userId, roomId)
      },
      { basicError: MESSAGE_I18N.changeMessageStatusFailed }
    )
  )
}
