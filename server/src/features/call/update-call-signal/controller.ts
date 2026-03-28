import type { IEventUpdateSignal, SocketActionsType } from 'common'

import { getActiveCallInterlocutor } from 'src/features/call'
import { getSocketsByUserIds } from 'src/features/user'

import { SocketInstanceType } from 'src/shared/config'
import { getIO, throwSocketError } from 'src/shared/lib'

export const controller = (socket: SocketInstanceType) => {
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
