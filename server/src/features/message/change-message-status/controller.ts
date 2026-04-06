import { IEventChangeMessageStatus, SocketActionsType } from 'common'

import { SocketInstanceType } from 'src/shared/config'
import { socketErrorMiddleware } from 'src/shared/middleware'

import { MESSAGE_I18N } from './../config'
import { changeMessageStatus } from './shared'

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
