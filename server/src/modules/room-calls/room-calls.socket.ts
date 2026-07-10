import { randomUUID } from 'crypto'

import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import {
  type EventDeclineRoomCall,
  type EventJoinRoomCall,
  type EventLeaveRoomCall,
  type EventLoadRoomCalls,
  type EventMarkRoomCallsAsSeen,
  type EventRoomCallsLoaded,
  type EventSendRoomCallQuickCommand,
  type EventSendRoomCallSignal,
  type EventSetRoomCallHandRaised,
  type EventStartRoomCall,
  type EventUpdateRoomCallMediaState,
  type JoinRoomCallAckPayload,
  type StartRoomCallAckPayload
} from 'global-shared'

import { socketAckMiddleware, socketErrorMiddleware } from 'src/shared/lib/socket-error'
import type { SocketInstance } from 'src/shared/types'

import { NotificationsService } from '../notifications/notifications.service'
import { RedisService } from '../security/redis.service'

import { cleanupStaleRoomCallParticipants } from './lib/cleanup-stale-room-call-participants'
import { saveRoomCallServerInstanceHeartbeat } from './lib/room-call-active-state'
import {
  ROOM_CALL_SERVER_INSTANCE_HEARTBEAT_INTERVAL_MS,
  ROOM_CALL_STALE_PARTICIPANT_CLEANUP_INTERVAL_MS
} from './room-calls.constants'
import { ROOM_CALLS_I18N } from './room-calls.i18n'
import {
  declineRoomCall,
  joinRoomCall,
  leaveActiveRoomCallsBySocket,
  leaveRoomCall,
  loadRoomCalls,
  markRoomCallsAsSeen,
  sendRoomCallQuickCommand,
  sendRoomCallSignal,
  setRoomCallHandRaised,
  startRoomCall,
  updateRoomCallMediaState
} from './room-calls.service'

@Injectable()
export class RoomCallsSocketService implements OnModuleInit, OnModuleDestroy {
  private readonly serverInstanceId = randomUUID()
  private heartbeatTimer: NodeJS.Timeout | null = null
  private staleParticipantCleanupTimer: NodeJS.Timeout | null = null

  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly redisService: RedisService
  ) {}

  async onModuleInit() {
    await saveRoomCallServerInstanceHeartbeat(this.redisService, this.serverInstanceId)
    await cleanupStaleRoomCallParticipants(this.redisService)
    this.heartbeatTimer = setInterval(() => {
      void saveRoomCallServerInstanceHeartbeat(this.redisService, this.serverInstanceId)
    }, ROOM_CALL_SERVER_INSTANCE_HEARTBEAT_INTERVAL_MS)
    this.staleParticipantCleanupTimer = setInterval(() => {
      void cleanupStaleRoomCallParticipants(this.redisService)
    }, ROOM_CALL_STALE_PARTICIPANT_CLEANUP_INTERVAL_MS)
  }

  onModuleDestroy() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }

    if (this.staleParticipantCleanupTimer) {
      clearInterval(this.staleParticipantCleanupTimer)
      this.staleParticipantCleanupTimer = null
    }
  }

  register(socket: SocketInstance) {
    socket.on(
      'start-room-call',
      socketAckMiddleware<EventStartRoomCall, StartRoomCallAckPayload>(
        socket,
        async (payload) => ({
          ok: true,
          payload: await startRoomCall(
            this.redisService,
            socket.data.userId,
            socket.id,
            this.serverInstanceId,
            this.notificationsService,
            payload
          )
        }),
        { basicError: ROOM_CALLS_I18N.roomCallStartFailed }
      )
    )

    socket.on(
      'join-room-call',
      socketAckMiddleware<EventJoinRoomCall, JoinRoomCallAckPayload>(
        socket,
        async (payload) => {
          const result = await joinRoomCall(
            this.redisService,
            socket.data.userId,
            socket.id,
            this.serverInstanceId,
            payload
          )

          if (!result) {
            return { ok: false, reason: 'join-failed' }
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
          await leaveRoomCall(this.redisService, socket.data.userId, socket.id, payload)
        },
        { basicError: ROOM_CALLS_I18N.roomCallLeaveFailed }
      )
    )

    socket.on(
      'load-room-calls',
      socketAckMiddleware<EventLoadRoomCalls, EventRoomCallsLoaded>(
        socket,
        async (payload) => {
          const roomCallsData = await loadRoomCalls(this.redisService, socket.data.userId, payload)

          if (!roomCallsData) {
            return { ok: false }
          }

          return {
            ok: true,
            payload: roomCallsData
          }
        },
        { basicError: ROOM_CALLS_I18N.roomCallLoadFailed }
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
      'mark-room-calls-as-seen',
      socketAckMiddleware<EventMarkRoomCallsAsSeen>(
        socket,
        async (payload) => {
          await markRoomCallsAsSeen(socket.data.userId, payload)
        },
        { basicError: ROOM_CALLS_I18N.roomCallMarkSeenFailed }
      )
    )

    socket.on(
      'update-room-call-media-state',
      socketAckMiddleware<EventUpdateRoomCallMediaState>(
        socket,
        async (payload) => {
          await updateRoomCallMediaState(this.redisService, socket.data.userId, socket.id, payload)
        },
        { basicError: ROOM_CALLS_I18N.roomCallUpdateMediaStateFailed }
      )
    )

    socket.on(
      'send-room-call-quick-command',
      socketAckMiddleware<EventSendRoomCallQuickCommand>(
        socket,
        async (payload) => {
          await sendRoomCallQuickCommand(this.redisService, socket.data.userId, socket.id, payload)
        },
        { basicError: ROOM_CALLS_I18N.roomCallQuickCommandFailed }
      )
    )

    socket.on(
      'set-room-call-hand-raised',
      socketAckMiddleware<EventSetRoomCallHandRaised>(
        socket,
        async (payload) => {
          await setRoomCallHandRaised(this.redisService, socket.data.userId, socket.id, payload)
        },
        { basicError: ROOM_CALLS_I18N.roomCallQuickCommandFailed }
      )
    )

    socket.on(
      'send-room-call-signal',
      socketAckMiddleware<EventSendRoomCallSignal>(
        socket,
        async (payload) => {
          await sendRoomCallSignal(this.redisService, socket.data.userId, socket.id, {
            ...payload,
            signalId: payload.signalId || randomUUID()
          })
        },
        { basicError: ROOM_CALLS_I18N.roomCallSignalFailed }
      )
    )

    socket.on(
      'disconnect',
      socketErrorMiddleware(
        socket,
        async () => {
          await leaveActiveRoomCallsBySocket(this.redisService, socket.data.userId, socket.id)
        },
        { basicError: ROOM_CALLS_I18N.roomCallLeaveFailed }
      )
    )
  }
}
