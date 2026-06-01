import { Injectable } from '@nestjs/common'
import type { EventJoinRoomCall, EventStartRoomCall, JoinRoomCallAckPayload, StartRoomCallAckPayload } from 'global-shared'

import { socketAckMiddleware } from 'src/shared/lib/socket-error'
import type { SocketInstance } from 'src/shared/types'

import { ROOM_CALLS_I18N } from './room-calls.i18n'
import { joinRoomCall, startRoomCall } from './room-calls.service'

@Injectable()
export class RoomCallsSocketService {
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
          const result = await joinRoomCall(socket.data.userId, socket.id, payload)

          if (!result) {
            return { ok: false }
          }

          return {
            ok: true,
            payload: result
          }
        },
        { basicError: ROOM_CALLS_I18N.roomCallJoinFailed }
      )
    )
  }
}
