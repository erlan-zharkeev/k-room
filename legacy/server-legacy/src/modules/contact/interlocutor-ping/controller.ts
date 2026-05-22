import { SocketActions } from 'common'

import { updateOnlineStatusController } from 'src/modules/user'

import { SocketInstance } from 'src/shared/config'
import { socketErrorMiddleware } from 'src/shared/middleware/socket-error-middleware'

import { CONTACT_I18N } from '../i18n'

export const interlocutorPingController = (socket: SocketInstance) => {
  socket.on<SocketActions>(
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
