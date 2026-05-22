import { EventCallStartedAt, EventAnswerCall, EventCallAccepted, SocketActions } from 'common'

import { getSocketsByUserIds } from 'src/modules/user'

import { SocketInstance } from 'src/shared/config'
import { getIO } from 'src/shared/lib/io'
import { socketErrorMiddleware } from 'src/shared/middleware/socket-error-middleware'

import { CallModel } from '../call.model'
import { CALL_I18N } from '../i18n'
import { setActiveCallInterlocutor } from '../shared/lib/active-call-map'
import { emitCallDataToInterlocutors } from '../shared/lib/emit-call-data-to-interlocutors'

export const answerCallController = (socket: SocketInstance) => {
  socket.on<SocketActions>(
    'answer-call',
    socketErrorMiddleware(
      socket,
      async ({ to, signal, selfSocketId, callId }: EventAnswerCall) => {
        const { userId } = socket.data
        const payload: EventCallAccepted = { signal }
        const interlocutorSocketIds = await getSocketsByUserIds([to])

        interlocutorSocketIds.forEach((socketId) => {
          getIO().to(socketId).emit<SocketActions>('call-accepted', payload)
        })

        const call = await CallModel.findOneAndUpdate(
          { _id: callId },
          { startedAt: Date.now(), answered: true },
          { new: true }
        ).lean()

        if (!call) return

        setActiveCallInterlocutor(userId, to)
        setActiveCallInterlocutor(to, userId)

        await emitCallDataToInterlocutors(call.interlocutors, String(call._id))

        const startedAtPayload: EventCallStartedAt = Date.now()

        interlocutorSocketIds.forEach((socketId) => {
          getIO().to(socketId).emit<SocketActions>('call-started-at', startedAtPayload)
        })

        getIO().to(selfSocketId).emit<SocketActions>('call-started-at', startedAtPayload)
      },
      { basicError: CALL_I18N.answerCallFailed }
    )
  )
}
