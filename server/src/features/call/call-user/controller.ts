import type { IEventCallUser, SocketActionsType } from 'common'

import { getSocketsByUserIds } from 'src/features/user'

import { CallModel } from 'src/entities/call'
import { UserModel } from 'src/entities/user'

import { SocketInstanceType } from 'src/shared/config'
import { getIO, throwSocketError } from 'src/shared/lib'

import { emitCallDataToInterlocutors, setActiveCallInterlocutor } from './../shared'

export const callUserController = (socket: SocketInstanceType) => {
  socket.on<SocketActionsType>('call-user', async ({ signal, userToCall, avatar, callerName }: IEventCallUser) => {
    if (!userToCall) return

    try {
      const { userId } = socket.data
      const interlocutor = await UserModel.findById(userToCall).lean()

      if (!interlocutor) return

      const call = await new CallModel({
        calledAt: Date.now(),
        authorId: userId,
        interlocutors: [userId, userToCall],
        answered: false
      }).save()

      setActiveCallInterlocutor(userId, userToCall)
      setActiveCallInterlocutor(userToCall, userId)

      const payload: IEventCallUser = {
        callId: String(call._id),
        signal,
        from: userId,
        avatar,
        callerName
      }

      const socketIds = await getSocketsByUserIds([userToCall])

      socketIds.forEach((socketId) => {
        getIO().to(socketId).emit<SocketActionsType>('call-user', payload)
      })

      await emitCallDataToInterlocutors([userId, userToCall], String(call._id), true)
    } catch {
      throwSocketError(socket.id)
    }
  })
}
