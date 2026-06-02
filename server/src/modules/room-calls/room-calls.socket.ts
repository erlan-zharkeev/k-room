import { Injectable } from '@nestjs/common'
import {
  ROOM_CALL_ACK_FAILURE_REASON,
  type EventDeclineRoomCall,
  type EventJoinRoomCall,
  type EventLeaveRoomCall,
  type EventSendRoomCallSignal,
  type EventStartRoomCall,
  type EventUpdateRoomCallMediaState,
  type JoinRoomCallAckPayload,
  type StartRoomCallAckPayload
} from 'global-shared'

import { socketAckMiddleware, socketErrorMiddleware } from 'src/shared/lib/socket-error'
import type { SocketInstance } from 'src/shared/types'

import { RedisService } from '../security/redis.service'

import { ROOM_CALLS_I18N } from './room-calls.i18n'
import {
  declineRoomCall,
  joinRoomCall,
  leaveActiveRoomCallsBySocket,
  leaveRoomCall,
  sendRoomCallSignal,
  startRoomCall,
  updateRoomCallMediaState
} from './room-calls.service'

@Injectable()
export class RoomCallsSocketService {
  constructor(private readonly redisService: RedisService) {}

  register(socket: SocketInstance) {
    socket.on(
      'start-room-call',
      socketAckMiddleware<EventStartRoomCall, StartRoomCallAckPayload>(
        socket,
        async (payload) => ({
          ok: true,
          payload: await startRoomCall(socket.data.userId, socket.id, payload)
        }),
        { basicError: ROOM_CALLS_I18N.roomCallStartFailed }
      )
    )

    socket.on(
      'join-room-call',
      socketAckMiddleware<EventJoinRoomCall, JoinRoomCallAckPayload>(
        socket,
        async (payload) => {
          const result = await joinRoomCall(this.redisService, socket.data.userId, socket.id, payload)

          if (!result) {
            return { ok: false, reason: ROOM_CALL_ACK_FAILURE_REASON.JOIN_FAILED }
          }

          return {
            ok: true,
            payload: result
          }
        },
        { basicError: ROOM_CALLS_I18N.roomCallJoinFailed }
      )
    )

    socket.on(
      'leave-room-call',
      socketAckMiddleware<EventLeaveRoomCall>(
        socket,
        async (payload) => {
          await leaveRoomCall(socket.data.userId, socket.id, payload)
        },
        { basicError: ROOM_CALLS_I18N.roomCallLeaveFailed }
      )
    )

    socket.on(
      'decline-room-call',
      socketAckMiddleware<EventDeclineRoomCall>(
        socket,
        async (payload) => {
          await declineRoomCall(this.redisService, socket.data.userId, payload)
        },
        { basicError: ROOM_CALLS_I18N.roomCallLeaveFailed }
      )
    )

    socket.on(
      'update-room-call-media-state',
      socketAckMiddleware<EventUpdateRoomCallMediaState>(
        socket,
        async (payload) => {
          await updateRoomCallMediaState(socket.data.userId, socket.id, payload)
        },
        { basicError: ROOM_CALLS_I18N.roomCallUpdateMediaStateFailed }
      )
    )

    socket.on(
      'send-room-call-signal',
      socketErrorMiddleware<EventSendRoomCallSignal>(
        socket,
        async (payload) => {
          await sendRoomCallSignal(socket.data.userId, socket.id, payload)
        },
        { basicError: ROOM_CALLS_I18N.roomCallSignalFailed }
      )
    )

    socket.on(
      'disconnect',
      socketErrorMiddleware(
        socket,
        async () => {
          await leaveActiveRoomCallsBySocket(socket.data.userId, socket.id)
        },
        { basicError: ROOM_CALLS_I18N.roomCallLeaveFailed }
      )
    )
  }
}
