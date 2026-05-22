import { IEventUpdateSignal, SocketActions } from 'common'

import { getSocketsByUserIds } from 'src/modules/user'

import { SocketInstance } from 'src/shared/config'
import { getIO } from 'src/shared/lib/io'
import { socketErrorMiddleware } from 'src/shared/middleware/socket-error-middleware'

import { CALL_I18N } from '../i18n'
import { getActiveCallInterlocutor } from '../shared/lib/active-call-map'

export const updateCallSignalController = (socket: SocketInstance) => {
  socket.on<SocketActions>(
    'update-call-signal',
    socketErrorMiddleware(
      socket,
      async ({ signal }: IEventUpdateSignal) => {
        const { userId } = socket.data
        const interlocutorId = getActiveCallInterlocutor(userId)

        if (!interlocutorId) return

        const socketIds = await getSocketsByUserIds([interlocutorId])

        socketIds.forEach((socketId) => {
          getIO().to(socketId).emit<SocketActions>('interlocutor-update-signal', { signal })
        })
      },
      { basicError: CALL_I18N.updateCallSignalFailed }
    )
  )
}
