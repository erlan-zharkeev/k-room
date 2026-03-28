import type { EventCallStartedAtType, IEventAnswerCall, IEventCallAccepted, SocketActionsType } from 'common'

import { emitCallDataToInterlocutors, setActiveCallInterlocutor } from 'src/features/call'
import { getSocketsByUserIds } from 'src/features/user'

import { CallModel } from 'src/entities/call'

import { SocketInstanceType } from 'src/shared/config'
import { getIO, throwSocketError } from 'src/shared/lib'

export const controller = (socket: SocketInstanceType) => {
  socket.on<SocketActionsType>('answer-call', async ({ to, signal, selfSocketId, callId }: IEventAnswerCall) => {
    try {
      const { userId } = socket.data
      const payload: IEventCallAccepted = { signal }
      const interlocutorSocketIds = await getSocketsByUserIds([to])

      interlocutorSocketIds.forEach((socketId) => {
        getIO().to(socketId).emit<SocketActionsType>('call-accepted', payload)
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

      const startedAtPayload: EventCallStartedAtType = Date.now()

      interlocutorSocketIds.forEach((socketId) => {
        getIO().to(socketId).emit<SocketActionsType>('call-started-at', startedAtPayload)
      })

      getIO().to(selfSocketId).emit<SocketActionsType>('call-started-at', startedAtPayload)
    } catch {
      throwSocketError(socket.id)
    }
  })
}
