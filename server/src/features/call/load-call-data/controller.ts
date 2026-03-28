import { SocketActionsType } from 'common'

import { SocketInstanceType } from 'src/shared/config'
import { throwSocketError } from 'src/shared/lib'

import { emitCallsToUser } from './../shared'

export const loadCallDataController = (socket: SocketInstanceType) => {
  socket.on<SocketActionsType>('initialize', async () => {
    try {
      await emitCallsToUser(socket.data.userId)
    } catch {
      throwSocketError(socket.id)
    }
  })
}
