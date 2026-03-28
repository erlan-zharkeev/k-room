import type { IEventCallEnded, SocketActionsType } from 'common'

import { clearActiveCallInterlocutor, emitCallDataToInterlocutors } from '../shared'
import { getSocketsByUserIds } from 'src/features/user'

import { CallModel } from 'src/entities/call'

import { SocketInstanceType } from 'src/shared/config'
import { getIO, throwSocketError } from 'src/shared/lib'

export const endCallController = (socket: SocketInstanceType) => {
  socket.on<SocketActionsType>('call-ended', async ({ callerId, callId }: IEventCallEnded) => {
    try {
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
    } catch {
      throwSocketError(socket.id)
    }
  })
}
