import {
  REQ_STATUS,
  ROOM_CALL_LOAD_LIMIT_MAX,
  ROOM_PARTICIPANT_LIMIT,
  type EventMarkRoomCallsAsSeen,
  isRoomPrivate,
  type EventDeclineRoomCall,
  type EventJoinRoomCall,
  type EventLeaveRoomCall,
  type EventLoadRoomCalls,
  type EventRoomCallsLoaded,
  type EventSendRoomCallQuickCommand,
  type EventSendRoomCallSignal,
  type EventSetRoomCallHandRaised,
  type EventStartRoomCall,
  type EventUpdateRoomCallMediaState,
  type JoinRoomCallAckPayload,
  type StartRoomCallAckPayload
} from 'global-shared'
import { Types } from 'mongoose'

import { AppError } from 'src/shared/lib/app-error'

import type { NotificationsService } from '../notifications/notifications.service'
import { emitToUsers } from '../presence/presence.utils'
import type { RedisService } from '../security/redis.service'
import { setUserLastSeenMissedRoomCallCalledAt } from '../user/lib/user-persistence'

import {
  assertActiveRoomCallAccess,
  assertRoomCallJoinAccess,
  assertRoomCallParticipantAccess,
  assertRoomCallStartAccess
} from './lib/assert-room-call-access'
import { buildRoomCallRtcConfiguration } from './lib/build-room-call-rtc-configuration'
import { cleanupStaleRoomCall } from './lib/cleanup-stale-room-call-participants'
import { finishRoomCall, leaveRoomCallParticipant } from './lib/leave-room-call-participant'
import { loadAvailableUserRoomCallPage } from './lib/load-available-user-room-call-page'
import { resolveRoomCallMediaKind } from './lib/resolve-room-call-media-kind'
import {
  createActiveRoomCall,
  readActiveRoomCallByRoomId,
  readActiveRoomCallsBySocketId,
  transformActiveRoomCallParticipant,
  transformActiveRoomCallToRoomCall,
  updateActiveRoomCall
} from './lib/room-call-active-state'
import { removeRoomCallDeclinedUser, saveRoomCallDeclinedUser } from './lib/room-call-decline-state'
import { emitRoomCallSignalReceived } from './lib/room-call-events'
import {
  buildInitialRoomCallMediaState,
  buildRoomCallParticipantQuickCommandStateByUserId,
  resolveActiveScreenSharingRoomCallParticipant,
  buildRoomCallActiveParticipant,
  resolveActiveRoomCallParticipantByUserId,
  resolveActiveRoomCallParticipants,
  resolveActiveRoomCallUserIds,
  resolveRoomCallParticipantByUserId
} from './lib/room-call-participant'
import { ROOM_CALLS_I18N } from './room-calls.i18n'
import type { RoomCallActiveState } from './room-calls.types'

export const startRoomCall = async (
  redisService: RedisService,
  userId: string,
  socketId: string,
  serverInstanceId: string,
  notificationsService: Pick<NotificationsService, 'sendRoomCallPushNotifications'> | undefined,
  { roomId, mediaKind }: EventStartRoomCall
): Promise<StartRoomCallAckPayload> => {
  const room = await assertRoomCallStartAccess(userId, roomId)
  const mediaState = buildInitialRoomCallMediaState(mediaKind)
  const participant = buildRoomCallActiveParticipant(userId, socketId, serverInstanceId, mediaState)
  const roomCall: RoomCallActiveState = {
    id: new Types.ObjectId().toString(),
    calledAt: Date.now(),
    roomId,
    initiatorId: userId,
    status: 'calling',
    mediaKind,
    participants: [participant]
  }
  const isCreated = await createActiveRoomCall(redisService, roomCall)

  if (!isCreated) {
    const activeRoomCall = await readActiveRoomCallByRoomId(redisService, roomId)

    if (activeRoomCall) {
      await cleanupStaleRoomCall(redisService, activeRoomCall)
    }
  }

  const isCreatedAfterCleanup = isCreated || (await createActiveRoomCall(redisService, roomCall))

  if (!isCreatedAfterCleanup) {
    throw new AppError(REQ_STATUS.badRequest, ROOM_CALLS_I18N.roomCallAlreadyActive, false, undefined, 'already-active')
  }

  const transformedRoomCall = transformActiveRoomCallToRoomCall(roomCall)

  emitToUsers(room.users, 'room-call-started', {
    roomCall: transformedRoomCall
  })
  void notificationsService?.sendRoomCallPushNotifications({
    roomId,
    roomCallId: roomCall.id,
    initiatorId: userId,
    recipientIds: room.users
  })

  return {
    rtcConfiguration: buildRoomCallRtcConfiguration(userId),
    roomCall: transformedRoomCall,
    roomCallId: roomCall.id
  }
}

export const joinRoomCall = async (
  redisService: RedisService,
  userId: string,
  socketId: string,
  serverInstanceId: string,
  { roomCallId }: EventJoinRoomCall
): Promise<JoinRoomCallAckPayload | null> => {
  const roomCall = await assertRoomCallJoinAccess(redisService, userId, roomCallId)
  const activeCurrentUserParticipant = resolveActiveRoomCallParticipantByUserId(roomCall.participants, userId)
  const isActiveOnAnotherSocket = activeCurrentUserParticipant && activeCurrentUserParticipant.socketId !== socketId

  if (isActiveOnAnotherSocket) {
    throw new AppError(
      REQ_STATUS.badRequest,
      ROOM_CALLS_I18N.roomCallAlreadyOpenOnAnotherDevice,
      false,
      undefined,
      'already-active'
    )
  }

  const mediaState = buildInitialRoomCallMediaState(roomCall.mediaKind)
  const participant = buildRoomCallActiveParticipant(userId, socketId, serverInstanceId, mediaState)
  let hasParticipantLimitReached = false
  let startedAt = roomCall.startedAt ?? Date.now()

  const updatedRoomCall = await updateActiveRoomCall(redisService, roomCallId, (currentRoomCall) => {
    const participantIndex = currentRoomCall.participants.findIndex(
      (currentParticipant) => currentParticipant.userId === userId
    )
    const currentParticipant = resolveRoomCallParticipantByUserId(currentRoomCall.participants, userId)
    const isCurrentParticipantActive = Boolean(currentParticipant && !currentParticipant.leftAt)
    const activeParticipants = resolveActiveRoomCallParticipants(currentRoomCall.participants)

    if (!isCurrentParticipantActive && activeParticipants.length >= ROOM_PARTICIPANT_LIMIT) {
      hasParticipantLimitReached = true
      return null
    }

    startedAt = currentRoomCall.startedAt ?? Date.now()

    if (participantIndex === -1) {
      return {
        ...currentRoomCall,
        status: 'in-progress',
        startedAt,
        participants: [...currentRoomCall.participants, participant]
      }
    }

    const participants = [...currentRoomCall.participants]
    participants[participantIndex] = participant

    return {
      ...currentRoomCall,
      status: 'in-progress',
      startedAt,
      participants
    }
  })

  if (hasParticipantLimitReached) {
    throw new AppError(REQ_STATUS.badRequest, ROOM_CALLS_I18N.roomCallLimitReached, false, undefined, 'limit-reached')
  }

  if (!updatedRoomCall) {
    return null
  }

  await removeRoomCallDeclinedUser(redisService, roomCallId, userId)

  const transformedRoomCall = transformActiveRoomCallToRoomCall(updatedRoomCall)

  emitToUsers(resolveActiveRoomCallUserIds(updatedRoomCall.participants), 'room-call-joined', {
    participant: transformActiveRoomCallParticipant(participant),
    roomCall: transformedRoomCall,
    roomCallId,
    startedAt
  })

  return {
    participantQuickCommandStateByUserId: buildRoomCallParticipantQuickCommandStateByUserId(
      updatedRoomCall.participants
    ),
    roomCall: transformedRoomCall,
    rtcConfiguration: buildRoomCallRtcConfiguration(userId)
  }
}

export const leaveRoomCall = async (
  redisService: RedisService,
  userId: string,
  socketId: string,
  payload: EventLeaveRoomCall
) => {
  const { room, roomCall } = await assertRoomCallParticipantAccess(redisService, userId, socketId, payload.roomCallId)
  const isPrivateRoom = isRoomPrivate(room)
  const isCallingRoomCall = roomCall.status === 'calling'

  if (isPrivateRoom) {
    await finishRoomCall(redisService, roomCall, room.users.map(String))
    return
  }

  const recipientIds = isCallingRoomCall ? room.users.map(String) : undefined

  await leaveRoomCallParticipant(redisService, roomCall, userId, socketId, payload.reason, recipientIds)
}

export const declineRoomCall = async (
  redisService: RedisService,
  userId: string,
  { roomCallId }: EventDeclineRoomCall
) => {
  const { room, roomCall } = await assertActiveRoomCallAccess(redisService, userId, roomCallId)
  const isInitiator = roomCall.initiatorId === userId
  const privateRoom = isRoomPrivate(room)

  if (isInitiator) {
    throw new AppError(REQ_STATUS.badRequest, ROOM_CALLS_I18N.roomCallAccessFailed)
  }

  const isCallingRoomCall = roomCall.status === 'calling'

  if (privateRoom || isCallingRoomCall) {
    await finishRoomCall(redisService, roomCall, room.users.map(String))
    return
  }

  await saveRoomCallDeclinedUser(redisService, roomCallId, userId)

  emitToUsers([userId], 'room-call-declined', {
    roomCallId,
    userId
  })
}

export const leaveActiveRoomCallsBySocket = async (redisService: RedisService, userId: string, socketId: string) => {
  const activeRoomCalls = await readActiveRoomCallsBySocketId(redisService, socketId)

  await Promise.all(
    activeRoomCalls.map(async (roomCall) => {
      await leaveRoomCallParticipant(redisService, roomCall, userId, socketId, 'disconnected')
    })
  )
}

export const loadRoomCalls = async (
  redisService: RedisService,
  userId: string,
  payload: EventLoadRoomCalls
): Promise<EventRoomCallsLoaded | null> => {
  const hasInvalidLimit = payload.limit < 1 || payload.limit > ROOM_CALL_LOAD_LIMIT_MAX

  if (hasInvalidLimit) {
    throw new AppError(REQ_STATUS.badRequest, ROOM_CALLS_I18N.roomCallLoadLimitExceeded)
  }

  return loadAvailableUserRoomCallPage(redisService, userId, payload)
}

export const markRoomCallsAsSeen = async (
  userId: string,
  { lastSeenMissedRoomCallCalledAt }: EventMarkRoomCallsAsSeen
) => {
  const hasInvalidCalledAt = !Number.isFinite(lastSeenMissedRoomCallCalledAt) || lastSeenMissedRoomCallCalledAt < 0

  if (hasInvalidCalledAt) {
    throw new AppError(REQ_STATUS.badRequest, ROOM_CALLS_I18N.roomCallMarkSeenFailed)
  }

  await setUserLastSeenMissedRoomCallCalledAt(userId, Math.min(lastSeenMissedRoomCallCalledAt, Date.now()))
}

export const updateRoomCallMediaState = async (
  redisService: RedisService,
  userId: string,
  socketId: string,
  { roomCallId, mediaState }: EventUpdateRoomCallMediaState
) => {
  await assertRoomCallParticipantAccess(redisService, userId, socketId, roomCallId)

  let updatedParticipantMediaState = mediaState
  const updatedRoomCall = await updateActiveRoomCall(redisService, roomCallId, (currentRoomCall) => {
    const screenSharingParticipant = resolveActiveScreenSharingRoomCallParticipant(currentRoomCall.participants)
    const wantsScreenSharing = mediaState.screen
    const hasScreenSharingParticipant = Boolean(screenSharingParticipant)
    const isScreenSharingParticipantCurrentUser = screenSharingParticipant?.userId === userId
    const hasScreenSharingConflict = hasScreenSharingParticipant && !isScreenSharingParticipantCurrentUser
    const hasAnotherScreenSharingParticipant = wantsScreenSharing && hasScreenSharingConflict

    updatedParticipantMediaState = hasAnotherScreenSharingParticipant
      ? {
          ...mediaState,
          screen: false
        }
      : mediaState
    const mediaKind = resolveRoomCallMediaKind(currentRoomCall.mediaKind, updatedParticipantMediaState)

    return {
      ...currentRoomCall,
      mediaKind,
      participants: currentRoomCall.participants.map((participant) => {
        const isCurrentUser = participant.userId === userId
        const isCurrentSocket = participant.socketId === socketId
        const isCurrentParticipant = isCurrentUser && isCurrentSocket

        return isCurrentParticipant ? { ...participant, mediaState: updatedParticipantMediaState } : participant
      })
    }
  })

  if (!updatedRoomCall) {
    return
  }

  emitToUsers(resolveActiveRoomCallUserIds(updatedRoomCall.participants), 'room-call-media-state-updated', {
    mediaKind: updatedRoomCall.mediaKind,
    mediaState: updatedParticipantMediaState,
    roomCallId,
    userId
  })
}

export const sendRoomCallQuickCommand = async (
  redisService: RedisService,
  userId: string,
  socketId: string,
  { quickCommand, roomCallId }: EventSendRoomCallQuickCommand
) => {
  const { roomCall } = await assertRoomCallParticipantAccess(redisService, userId, socketId, roomCallId)

  emitToUsers(resolveActiveRoomCallUserIds(roomCall.participants), 'room-call-quick-command-received', {
    createdAt: Date.now(),
    quickCommand,
    roomCallId,
    userId
  })
}

export const setRoomCallHandRaised = async (
  redisService: RedisService,
  userId: string,
  socketId: string,
  { handRaised, roomCallId }: EventSetRoomCallHandRaised
) => {
  await assertRoomCallParticipantAccess(redisService, userId, socketId, roomCallId)

  const updatedAt = Date.now()
  const updatedRoomCall = await updateActiveRoomCall(redisService, roomCallId, (currentRoomCall) => ({
    ...currentRoomCall,
    participants: currentRoomCall.participants.map((participant) => {
      const isCurrentUser = participant.userId === userId
      const isCurrentSocket = participant.socketId === socketId
      const isCurrentParticipant = isCurrentUser && isCurrentSocket

      return isCurrentParticipant
        ? {
            ...participant,
            quickCommandState: {
              ...participant.quickCommandState,
              handRaised
            }
          }
        : participant
    })
  }))

  if (!updatedRoomCall) {
    return
  }

  emitToUsers(resolveActiveRoomCallUserIds(updatedRoomCall.participants), 'room-call-hand-raised-updated', {
    handRaised,
    roomCallId,
    updatedAt,
    userId
  })
}

export const sendRoomCallSignal = async (
  redisService: RedisService,
  userId: string,
  socketId: string,
  { roomCallId, signal, signalId, signalKind, toUserId }: EventSendRoomCallSignal
) => {
  const { roomCall } = await assertRoomCallParticipantAccess(redisService, userId, socketId, roomCallId)
  const targetParticipant = resolveActiveRoomCallParticipantByUserId(roomCall.participants, toUserId)

  if (!targetParticipant) {
    throw new AppError(REQ_STATUS.badRequest, ROOM_CALLS_I18N.roomCallSignalFailed)
  }

  try {
    const delivered = await emitRoomCallSignalReceived(targetParticipant.socketId, {
      fromUserId: userId,
      roomCallId,
      signal,
      signalId,
      signalKind
    })

    if (!delivered) {
      throw new Error('Room call signal recipient did not acknowledge delivery')
    }
  } catch (error) {
    throw new AppError(REQ_STATUS.server, ROOM_CALLS_I18N.roomCallSignalFailed, true, error)
  }
}
