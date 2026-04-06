import { IEventCallEnded, SocketActionsType } from 'common'

import { getSocketsByUserIds } from 'src/features/user'

import { CallModel } from 'src/entities/call'

import { SocketInstanceType } from 'src/shared/config'
import { getIO } from 'src/shared/lib'
import { socketErrorMiddleware } from 'src/shared/middleware'

import { CALL_I18N } from './../config'
import { clearActiveCallInterlocutor, emitCallDataToInterlocutors } from './../shared'

export const endCallController = (socket: SocketInstanceType) => {
  socket.on<SocketActionsType>(
    'call-ended',
    socketErrorMiddleware(
      socket,
      async ({ callerId, callId }: IEventCallEnded) => {
        const { userId } = socket.data
        const socketIds = await getSocketsByUserIds([callerId])

        socketIds.forEach((socketId) => {
          getIO().to(socketId).emit<SocketActionsType>('call-ended')
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
