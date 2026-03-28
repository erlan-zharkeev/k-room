import { SocketActionsType } from 'common'

import { emitCallsToUser } from 'src/features/call'

import { SocketInstanceType } from 'src/shared/config'
import { throwSocketError } from 'src/shared/lib'

export const controller = (socket: SocketInstanceType) => {
  socket.on<SocketActionsType>('initialize', async () => {
    try {
      await emitCallsToUser(socket.data.userId)
    } catch {
      throwSocketError(socket.id)
    }
  })
}
