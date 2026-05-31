import { Injectable } from '@nestjs/common'
import type { EventAnswerCall, EventCallEnded, EventCallUser, EventMarkCallAsVideo } from 'global-shared'

import { socketErrorMiddleware } from 'src/shared/lib/socket-error'
import type { SocketInstance } from 'src/shared/types/socket'

import { CALLS_I18N } from './calls.i18n'
import { answerCall, callUser, emitCallsToUser, endCall, markCallAsVideo } from './calls.service'

@Injectable()
export class CallsSocketService {
  register(socket: SocketInstance) {
    socket.on(
      'initialize',
      socketErrorMiddleware(
        socket,
        async () => {
          await emitCallsToUser(socket.data.userId)
        },
        { basicError: CALLS_I18N.loadCallDataFailed }
      )
    )

    socket.on(
      'mark-call-as-video',
      socketErrorMiddleware<EventMarkCallAsVideo>(
        socket,
        async ({ callId }) => {
          await markCallAsVideo(callId)
        },
        { basicError: CALLS_I18N.markCallAsVideoFailed }
      )
    )

    socket.on(
      'call-user',
      socketErrorMiddleware<EventCallUser>(
        socket,
        async (payload) => {
          await callUser(socket.data.userId, payload)
        },
        { basicError: CALLS_I18N.callUserFailed }
      )
    )

    socket.on(
      'answer-call',
      socketErrorMiddleware<EventAnswerCall>(
        socket,
        async (payload) => {
          await answerCall(payload)
        },
        { basicError: CALLS_I18N.answerCallFailed }
      )
    )

    socket.on(
      'call-ended',
      socketErrorMiddleware<EventCallEnded>(
        socket,
        async (payload) => {
          await endCall(payload)
        },
        { basicError: CALLS_I18N.endCallFailed }
      )
    )
  }
}
