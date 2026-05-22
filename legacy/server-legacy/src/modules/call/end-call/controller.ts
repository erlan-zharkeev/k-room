import { EventCallEnded, SocketActions } from 'common'

import { getSocketsByUserIds } from 'src/modules/user'

import { SocketInstance } from 'src/shared/config'
import { getIO } from 'src/shared/lib/io'
import { socketErrorMiddleware } from 'src/shared/middleware/socket-error-middleware'

import { CallModel } from '../call.model'
import { CALL_I18N } from '../i18n'
import { clearActiveCallInterlocutor } from '../shared/lib/active-call-map'
import { emitCallDataToInterlocutors } from '../shared/lib/emit-call-data-to-interlocutors'

export const endCallController = (socket: SocketInstance) => {
  socket.on<SocketActions>(
    'call-ended',
    socketErrorMiddleware(
      socket,
      async ({ callerId, callId }: EventCallEnded) => {
        const { userId } = socket.data
        const socketIds = await getSocketsByUserIds([callerId])

        socketIds.forEach((socketId) => {
          getIO().to(socketId).emit<SocketActions>('call-ended')
        })

        clearActiveCallInterlocutor(userId)
        clearActiveCallInterlocutor(callerId)

        const call = await CallModel.findOneAndUpdate({ _id: callId }, { finishedAt: Date.now() }, { new: true }).lean()

        if (!call) return

        await emitCallDataToInterlocutors(call.interlocutors, String(call._id))
      },
      { basicError: CALL_I18N.endCallFailed }
    )
  )
}
