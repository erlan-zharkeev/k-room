import type {
  EventCallStartedAt,
  EventAnswerCall,
  EventCallAccepted,
  EventCallEnded,
  EventCallUser,
  EventMarkCallAsVideo,
  SocketActions
} from 'global-shared'

import { getIO } from 'src/shared/lib/io'
import { socketErrorMiddleware } from 'src/shared/lib/socket-error'
import type { SocketInstance } from 'src/shared/types/socket'

import { emitToUsers } from '../presence/presence.utils'
import { UserModel } from '../user/user.model'

import { CALLS_I18N } from './calls.i18n'
import { CallModel } from './calls.model'
import { emitCallDataToInterlocutors, emitCallsToUser } from './calls.service'
import type { CallDocument } from './calls.types'

export const registerCallSocketHandlers = (socket: SocketInstance) => {
  socket.on<SocketActions>(
    'initialize',
    socketErrorMiddleware(
      socket,
      async () => {
        await emitCallsToUser(socket.data.userId)
      },
      { basicError: CALLS_I18N.loadCallDataFailed }
    )
  )

  socket.on<SocketActions>(
    'mark-call-as-video',
    socketErrorMiddleware(
      socket,
      async ({ callId }: EventMarkCallAsVideo) => {
        await CallModel.updateOne({ _id: callId }, { video: true })
      },
      { basicError: CALLS_I18N.markCallAsVideoFailed }
    )
  )

  socket.on<SocketActions>(
    'call-user',
    socketErrorMiddleware(
      socket,
      async ({ signal, userToCall, avatar, callerNickname }: EventCallUser) => {
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

  socket.on<SocketActions>(
    'answer-call',
    socketErrorMiddleware(
      socket,
      async ({ to, signal, selfSocketId, callId }: EventAnswerCall) => {
        const payload: EventCallAccepted = { signal }

        emitToUsers([to], 'call-accepted', payload)

        const call = await CallModel.findOneAndUpdate(
          { _id: callId },
          { startedAt: Date.now(), answered: true },
          { new: true }
        ).lean<CallDocument>()

        if (!call) {
          return
        }

        await emitCallDataToInterlocutors(call.interlocutors, String(call._id))

        const startedAtPayload: EventCallStartedAt = Date.now()

        emitToUsers([to], 'call-started-at', startedAtPayload)
        getIO().to(selfSocketId).emit<SocketActions>('call-started-at', startedAtPayload)
      },
      { basicError: CALLS_I18N.answerCallFailed }
    )
  )

  socket.on<SocketActions>(
    'call-ended',
    socketErrorMiddleware(
      socket,
      async ({ callerId, callId }: EventCallEnded) => {
        emitToUsers([callerId], 'call-ended')

        const call = await CallModel.findOneAndUpdate(
          { _id: callId },
          { finishedAt: Date.now() },
          { new: true }
        ).lean<CallDocument>()

        if (!call) {
          return
        }

        await emitCallDataToInterlocutors(call.interlocutors, String(call._id))
      },
      { basicError: CALLS_I18N.endCallFailed }
    )
  )
}
