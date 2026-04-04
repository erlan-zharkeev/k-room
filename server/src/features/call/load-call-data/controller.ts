import { SocketActionsType } from 'common'

import { SocketInstanceType } from 'src/shared/config'
import { socketErrorMiddleware } from 'src/shared/middleware/socket-error-middleware'

import { CALL_I18N } from './../config'
import { emitCallsToUser } from './../shared'

export const loadCallDataController = (socket: SocketInstanceType) => {
  socket.on<SocketActionsType>(
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
