import type {
  EventCallStartedAtType,
  IEventAnswerCall,
  IEventCallAccepted,
  IEventCallEnded,
  IEventCallUser,
  IEventMarkCallAsVideo,
  IEventUpdateSignal,
  SocketActionsType
} from 'global-shared'

import { getIO } from 'src/shared/lib/io'
import { socketErrorMiddleware } from 'src/shared/lib/socket-error'
import type { SocketInstanceType } from 'src/shared/types/socket'

import { UserModel } from '../user/user.model'
import { getSocketsByUserIds } from '../user/user.service'

import { CALLS_I18N } from './calls.i18n'
import { CallModel } from './calls.model'
import {
  clearActiveCallInterlocutor,
  emitCallDataToInterlocutors,
  emitCallsToUser,
  getActiveCallInterlocutor,
  setActiveCallInterlocutor
} from './calls.service'

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
      async ({ signal, userToCall, avatar, callerName }: IEventCallUser) => {
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

        setActiveCallInterlocutor(userId, userToCall)
        setActiveCallInterlocutor(userToCall, userId)

        const sockets = await getSocketsByUserIds([userToCall])

        sockets.forEach((socketId) => {
          getIO()
            .to(socketId)
            .emit<SocketActionsType>('call-user', {
              callId: String(call._id),
              signal,
              from: userId,
              avatar,
              callerName
            })
        })

        await emitCallDataToInterlocutors([userId, userToCall], String(call._id), true)
      },
      { basicError: CALLS_I18N.callUserFailed }
    )
  )

  socket.on<SocketActionsType>(
    'update-call-signal',
    socketErrorMiddleware(
      socket,
      async ({ signal }: IEventUpdateSignal) => {
        const interlocutorId = getActiveCallInterlocutor(socket.data.userId)

        if (!interlocutorId) {
          return
        }

        const sockets = await getSocketsByUserIds([interlocutorId])

        sockets.forEach((socketId) => {
          getIO().to(socketId).emit<SocketActionsType>('interlocutor-update-signal', { signal })
        })
      },
      { basicError: CALLS_I18N.updateCallSignalFailed }
    )
  )

  socket.on<SocketActionsType>(
    'answer-call',
    socketErrorMiddleware(
      socket,
      async ({ to, signal, selfSocketId, callId }: IEventAnswerCall) => {
        const { userId } = socket.data
        const sockets = await getSocketsByUserIds([to])
        const payload: IEventCallAccepted = { signal }

        sockets.forEach((socketId) => {
          getIO().to(socketId).emit<SocketActionsType>('call-accepted', payload)
        })

        const call = await CallModel.findOneAndUpdate(
          { _id: callId },
          { startedAt: Date.now(), answered: true },
          { new: true }
        ).lean()

        if (!call) {
          return
        }

        setActiveCallInterlocutor(userId, to)
        setActiveCallInterlocutor(to, userId)
        await emitCallDataToInterlocutors(call.interlocutors, String(call._id))

        const startedAtPayload: EventCallStartedAtType = Date.now()

        sockets.forEach((socketId) => {
          getIO().to(socketId).emit<SocketActionsType>('call-started-at', startedAtPayload)
        })

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
        const { userId } = socket.data
        const sockets = await getSocketsByUserIds([callerId])

        sockets.forEach((socketId) => {
          getIO().to(socketId).emit<SocketActionsType>('call-ended')
        })

        clearActiveCallInterlocutor(userId)
        clearActiveCallInterlocutor(callerId)

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
