import type {
  EventCallStartedAtType,
  IEventAnswerCall,
  IEventCallAccepted,
  IEventCallEnded,
  IEventCallUser,
  IEventMarkCallAsVideo,
  SocketActionsType
} from 'global-shared'

import { getIO } from 'src/shared/lib/io'
import { socketErrorMiddleware } from 'src/shared/lib/socket-error'
import type { SocketInstanceType } from 'src/shared/types/socket'

import { emitToUsers } from '../presence/presence.service'
import { UserModel } from '../user/user.model'

import { CALLS_I18N } from './calls.i18n'
import { CallModel } from './calls.model'
import { emitCallDataToInterlocutors, emitCallsToUser } from './calls.service'

export const registerCallSocketHandlers = (socket: SocketInstanceType) => {
  socket.on<SocketActionsType>(
    'initialize',
    socketErrorMiddleware(
      socket,
      async () => {
        await emitCallsToUser(socket.data.userId)
      },
      { basicError: CALLS_I18N.loadCallDataFailed }
    )
  )

  socket.on<SocketActionsType>(
    'mark-call-as-video',
    socketErrorMiddleware(
      socket,
      async ({ callId }: IEventMarkCallAsVideo) => {
        await CallModel.updateOne({ _id: callId }, { video: true })
      },
      { basicError: CALLS_I18N.markCallAsVideoFailed }
    )
  )

  socket.on<SocketActionsType>(
    'call-user',
    socketErrorMiddleware(
      socket,
      async ({ signal, userToCall, avatar, callerNickname }: IEventCallUser) => {
        if (!userToCall) {
          return
        }

        const { userId } = socket.data
        const interlocutor = await UserModel.findById(userToCall).lean()

        if (!interlocutor) {
          return
        }

        const call = await new CallModel({
          calledAt: Date.now(),
          authorId: userId,
          interlocutors: [userId, userToCall],
          answered: false
        }).save()

        emitToUsers([userToCall], 'call-user', {
          callId: String(call._id),
          signal,
          from: userId,
          avatar,
          callerNickname
        })

        await emitCallDataToInterlocutors([userId, userToCall], String(call._id), true)
      },
      { basicError: CALLS_I18N.callUserFailed }
    )
  )

  socket.on<SocketActionsType>(
    'answer-call',
    socketErrorMiddleware(
      socket,
      async ({ to, signal, selfSocketId, callId }: IEventAnswerCall) => {
        const payload: IEventCallAccepted = { signal }

        emitToUsers([to], 'call-accepted', payload)

        const call = await CallModel.findOneAndUpdate(
          { _id: callId },
          { startedAt: Date.now(), answered: true },
          { new: true }
        ).lean()

        if (!call) {
          return
        }

        await emitCallDataToInterlocutors(call.interlocutors, String(call._id))

        const startedAtPayload: EventCallStartedAtType = Date.now()

        emitToUsers([to], 'call-started-at', startedAtPayload)
        getIO().to(selfSocketId).emit<SocketActionsType>('call-started-at', startedAtPayload)
      },
      { basicError: CALLS_I18N.answerCallFailed }
    )
  )

  socket.on<SocketActionsType>(
    'call-ended',
    socketErrorMiddleware(
      socket,
      async ({ callerId, callId }: IEventCallEnded) => {
        emitToUsers([callerId], 'call-ended')

        const call = await CallModel.findOneAndUpdate({ _id: callId }, { finishedAt: Date.now() }, { new: true }).lean()

        if (!call) {
          return
        }

        await emitCallDataToInterlocutors(call.interlocutors, String(call._id))
      },
      { basicError: CALLS_I18N.endCallFailed }
    )
  )
}
