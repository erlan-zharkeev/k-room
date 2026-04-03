import { IEventUpdateSignal, SocketActionsType } from 'common'

import { getSocketsByUserIds } from 'src/features/user'

import { SocketInstanceType } from 'src/shared/config'
import { getIO, throwSocketError } from 'src/shared/lib'

import { getActiveCallInterlocutor } from './../shared'

export const updateCallSignalController = (socket: SocketInstanceType) => {
  socket.on<SocketActionsType>('update-call-signal', async ({ signal }: IEventUpdateSignal) => {
    try {
      const { userId } = socket.data
      const interlocutorId = getActiveCallInterlocutor(userId)

      if (!interlocutorId) return

      const socketIds = await getSocketsByUserIds([interlocutorId])

      socketIds.forEach((socketId) => {
        getIO().to(socketId).emit<SocketActionsType>('interlocutor-update-signal', { signal })
      })
    } catch {
      throwSocketError(socket.id)
    }
  })
}
