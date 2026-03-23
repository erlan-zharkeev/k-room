import type { IEventCallEnded, SocketActionsType } from 'common-types'

import { clearActiveCallInterlocutor, emitCallDataToInterlocutors } from 'features/call'
import { getSocketsByUserIds } from 'features/user'

import { CallModel } from 'entities/call'

import { SocketInstanceType } from 'shared-config'
import { getIO, throwSocketError } from 'shared-lib'

export const controller = (socket: SocketInstanceType) => {
  socket.on<SocketActionsType>('call-ended', async ({ callerId, callId }: IEventCallEnded) => {
    try {
      const { userId } = socket.data
      const socketIds = await getSocketsByUserIds([callerId])

      socketIds.forEach((socketId) => {
        getIO().to(socketId).emit<SocketActionsType>('call-ended')
      })

      clearActiveCallInterlocutor(userId)
      clearActiveCallInterlocutor(callerId)

      const call = await CallModel.findOneAndUpdate(
        { _id: callId },
        { finishedAt: Date.now() },
        { new: true }
      ).lean()

      if (!call) return

      await emitCallDataToInterlocutors(call.interlocutors, String(call._id))
    } catch {
      throwSocketError(socket.id)
    }
  })
}
