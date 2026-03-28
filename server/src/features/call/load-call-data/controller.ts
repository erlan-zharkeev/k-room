import { SocketActionsType } from 'common'

import { emitCallsToUser } from './../shared'

import { SocketInstanceType } from 'src/shared/config'
import { throwSocketError } from 'src/shared/lib'

export const loadCallDataController = (socket: SocketInstanceType) => {
  socket.on<SocketActionsType>('initialize', async () => {
    try {
      await emitCallsToUser(socket.data.userId)
    } catch {
      throwSocketError(socket.id)
    }
  })
}
