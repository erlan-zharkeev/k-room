import { Injectable } from '@nestjs/common'
import type { EventAnswerCall, EventCallEnded, EventCallUser, EventMarkCallAsVideo, SocketActions } from 'global-shared'

import { socketErrorMiddleware } from 'src/shared/lib/socket-error'
import type { SocketInstance } from 'src/shared/types/socket'

import { CALLS_I18N } from './calls.i18n'
import { answerCall, callUser, emitCallsToUser, endCall, markCallAsVideo } from './calls.service'

@Injectable()
export class CallsSocketService {
  register(socket: SocketInstance) {
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
          await markCallAsVideo(callId)
        },
        { basicError: CALLS_I18N.markCallAsVideoFailed }
      )
    )

    socket.on<SocketActions>(
      'call-user',
      socketErrorMiddleware(
        socket,
        async (payload: EventCallUser) => {
          await callUser(socket.data.userId, payload)
        },
        { basicError: CALLS_I18N.callUserFailed }
      )
    )

    socket.on<SocketActions>(
      'answer-call',
      socketErrorMiddleware(
        socket,
        async (payload: EventAnswerCall) => {
          await answerCall(payload)
        },
        { basicError: CALLS_I18N.answerCallFailed }
      )
    )

    socket.on<SocketActions>(
      'call-ended',
      socketErrorMiddleware(
        socket,
        async (payload: EventCallEnded) => {
          await endCall(payload)
        },
        { basicError: CALLS_I18N.endCallFailed }
      )
    )
  }
}
