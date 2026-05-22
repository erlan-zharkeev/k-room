import { EventCallUser, SocketActions } from 'common'

import { getSocketsByUserIds } from 'src/modules/user'
import { UserModel } from 'src/modules/user'

import { SocketInstance } from 'src/shared/config'
import { getIO } from 'src/shared/lib/io'
import { socketErrorMiddleware } from 'src/shared/middleware/socket-error-middleware'

import { CallModel } from '../call.model'
import { CALL_I18N } from '../i18n'
import { setActiveCallInterlocutor } from '../shared/lib/active-call-map'
import { emitCallDataToInterlocutors } from '../shared/lib/emit-call-data-to-interlocutors'

export const callUserController = (socket: SocketInstance) => {
  socket.on<SocketActions>(
    'call-user',
    socketErrorMiddleware(
      socket,
      async ({ signal, userToCall, avatar, callerName }: EventCallUser) => {
        if (!userToCall) return

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

        const payload: EventCallUser = {
          callId: String(call._id),
          signal,
          from: userId,
          avatar,
          callerName
        }

        const socketIds = await getSocketsByUserIds([userToCall])

        socketIds.forEach((socketId) => {
          getIO().to(socketId).emit<SocketActions>('call-user', payload)
        })

        await emitCallDataToInterlocutors([userId, userToCall], String(call._id), true)
      },
      { basicError: CALL_I18N.callUserFailed }
    )
  )
}
