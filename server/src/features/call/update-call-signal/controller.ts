import { IEventUpdateSignal, SocketActionsType } from 'common'

import { getSocketsByUserIds } from 'src/features/user'

import { SocketInstanceType } from 'src/shared/config'
import { getIO } from 'src/shared/lib'
import { socketErrorMiddleware } from 'src/shared/middleware/socket-error-middleware'

import { CALL_I18N } from './../config'
import { getActiveCallInterlocutor } from './../shared'

export const updateCallSignalController = (socket: SocketInstanceType) => {
  socket.on<SocketActionsType>(
    'update-call-signal',
    socketErrorMiddleware(
      socket,
      async ({ signal }: IEventUpdateSignal) => {
        const { userId } = socket.data
        const interlocutorId = getActiveCallInterlocutor(userId)

        if (!interlocutorId) return

        const socketIds = await getSocketsByUserIds([interlocutorId])

        socketIds.forEach((socketId) => {
          getIO().to(socketId).emit<SocketActionsType>('interlocutor-update-signal', { signal })
        })
      },
      { basicError: CALL_I18N.updateCallSignalFailed }
    )
  )
}
