import { SocketActionsType } from 'common'

import { emitCallsToUser } from 'features/call'

import { SocketInstanceType } from 'shared-config'
import { throwSocketError } from 'shared-lib'

export const controller = (socket: SocketInstanceType) => {
  socket.on<SocketActionsType>('initialize', async () => {
    try {
      await emitCallsToUser(socket.data.userId)
    } catch {
      throwSocketError(socket.id)
    }
  })
}
