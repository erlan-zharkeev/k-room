import { SocketActionsType } from 'common'

import { updateOnlineStatusController } from 'src/modules/user'

import { SocketInstanceType } from 'src/shared/config'
import { socketErrorMiddleware } from 'src/shared/middleware/socket-error-middleware'

import { CONTACT_I18N } from '../i18n'

export const interlocutorPingController = (socket: SocketInstanceType) => {
  socket.on<SocketActionsType>(
    'interlocutor-ping',
    socketErrorMiddleware(
      socket,
      async () => {
        const { userId } = socket.data
        await updateOnlineStatusController(userId, true)
      },
      { basicError: CONTACT_I18N.interlocutorPingFailed }
    )
  )
}
