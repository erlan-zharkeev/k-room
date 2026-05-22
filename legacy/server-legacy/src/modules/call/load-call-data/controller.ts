import { SocketActions } from 'common'

import { SocketInstance } from 'src/shared/config'
import { socketErrorMiddleware } from 'src/shared/middleware/socket-error-middleware'

import { CALL_I18N } from '../i18n'
import { emitCallsToUser } from '../shared/lib/emit-calls-to-user'

export const loadCallDataController = (socket: SocketInstance) => {
  socket.on<SocketActions>(
    'initialize',
    socketErrorMiddleware(
      socket,
      async () => {
        await emitCallsToUser(socket.data.userId)
      },
      { basicError: CALL_I18N.loadCallDataFailed }
    )
  )
}
