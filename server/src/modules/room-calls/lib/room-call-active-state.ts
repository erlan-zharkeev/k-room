import { isString, type RoomCall } from 'global-shared'

import type { RedisService } from 'src/modules/security/redis.service'

import {
  ROOM_CALL_ACTIVE_STATE_CREATE_SCRIPT,
  ROOM_CALL_ACTIVE_STATE_KEY_PREFIX,
  ROOM_CALL_ACTIVE_STATE_REMOVE_SCRIPT,
  ROOM_CALL_ACTIVE_STATE_TTL_MS,
  ROOM_CALL_ACTIVE_STATE_UPDATE_SCRIPT,
  ROOM_CALL_SERVER_INSTANCE_HEARTBEAT_TTL_MS
} from '../constants'
import type { RoomCallActiveState } from '../room-calls.types'

const buildActiveRoomCallKey = (roomCallId: string) => `${ROOM_CALL_ACTIVE_STATE_KEY_PREFIX.CALL}:${roomCallId}`

const buildActiveRoomCallRoomKey = (roomId: string) => `${ROOM_CALL_ACTIVE_STATE_KEY_PREFIX.ROOM}:${roomId}`

const buildActiveRoomCallSocketKey = (socketId: string) => `${ROOM_CALL_ACTIVE_STATE_KEY_PREFIX.SOCKET}:${socketId}`

const buildRoomCallServerInstanceKey = (serverInstanceId: string) =>
  `${ROOM_CALL_ACTIVE_STATE_KEY_PREFIX.SERVER_INSTANCE}:${serverInstanceId}`

const parseActiveRoomCallState = (value: string): RoomCallActiveState => JSON.parse(value) as RoomCallActiveState

const stringifyActiveRoomCallState = (roomCall: RoomCallActiveState) => JSON.stringify(roomCall)

const isRedisScriptSuccess = (result: unknown) => result === 1

const runRoomCallActiveStateScript = async (
  redisService: RedisService,
  script: string,
  keys: string[],
  args: string[]
) => {
  const result = await redisService.runCommand(['EVAL', script, String(keys.length), ...keys, ...args])

  return isRedisScriptSuccess(result)
}

const resolveActiveSocketIds = (roomCall: RoomCallActiveState) =>
  roomCall.participants.filter((participant) => !participant.leftAt).map((participant) => participant.socketId)

const refreshActiveRoomCallSocketIndex = async (redisService: RedisService, roomCallId: string, socketId: string) => {
  const key = buildActiveRoomCallSocketKey(socketId)

  await redisService.addSetValue(key, roomCallId)
  await redisService.refreshTtl(key, ROOM_CALL_ACTIVE_STATE_TTL_MS)
}

const syncActiveRoomCallSocketIndexes = async (
  redisService: RedisService,
  roomCallId: string,
  currentRoomCall: RoomCallActiveState,
  nextRoomCall: RoomCallActiveState
) => {
  const currentSocketIds = new Set(resolveActiveSocketIds(currentRoomCall))
  const nextSocketIds = new Set(resolveActiveSocketIds(nextRoomCall))
  const socketIdsToRemove = [...currentSocketIds].filter((socketId) => !nextSocketIds.has(socketId))

  await Promise.all([
    ...[...nextSocketIds].map((socketId) => refreshActiveRoomCallSocketIndex(redisService, roomCallId, socketId)),
    ...socketIdsToRemove.map((socketId) =>
      redisService.removeSetValue(buildActiveRoomCallSocketKey(socketId), roomCallId)
    )
  ])
}

export const transformActiveRoomCallParticipant = ({
  quickCommandState: _quickCommandState,
  serverInstanceId: _serverInstanceId,
  ...participant
}: RoomCallActiveState['participants'][number]) => participant

export const transformActiveRoomCallToRoomCall = (roomCall: RoomCallActiveState): RoomCall => ({
  ...roomCall,
  participants: roomCall.participants.map(transformActiveRoomCallParticipant)
})

export const saveRoomCallServerInstanceHeartbeat = async (redisService: RedisService, serverInstanceId: string) => {
  await redisService.write(
    buildRoomCallServerInstanceKey(serverInstanceId),
    '1',
    ROOM_CALL_SERVER_INSTANCE_HEARTBEAT_TTL_MS
  )
}

export const isRoomCallServerInstanceAlive = async (redisService: RedisService, serverInstanceId: string) =>
  Boolean(await redisService.read(buildRoomCallServerInstanceKey(serverInstanceId)))

export const createActiveRoomCall = async (redisService: RedisService, roomCall: RoomCallActiveState) => {
  const [participant] = roomCall.participants

  if (!participant) {
    return false
  }

  return runRoomCallActiveStateScript(
    redisService,
    ROOM_CALL_ACTIVE_STATE_CREATE_SCRIPT,
    [
      buildActiveRoomCallRoomKey(roomCall.roomId),
      buildActiveRoomCallKey(roomCall.id),
      ROOM_CALL_ACTIVE_STATE_KEY_PREFIX.ALL,
      buildActiveRoomCallSocketKey(participant.socketId)
    ],
    [roomCall.id, stringifyActiveRoomCallState(roomCall), String(ROOM_CALL_ACTIVE_STATE_TTL_MS)]
  )
}

export const readActiveRoomCall = async (redisService: RedisService, roomCallId: string) => {
  const value = await redisService.read(buildActiveRoomCallKey(roomCallId))

  return value ? parseActiveRoomCallState(value) : null
}

export const readActiveRoomCallByRoomId = async (redisService: RedisService, roomId: string) => {
  const roomCallId = await redisService.read(buildActiveRoomCallRoomKey(roomId))

  return roomCallId ? readActiveRoomCall(redisService, roomCallId) : null
}

export const readActiveRoomCallsByRoomIds = async (redisService: RedisService, roomIds: string[]) => {
  const roomCallIds = (await redisService.readMany(roomIds.map(buildActiveRoomCallRoomKey))).filter(isString)
  const roomCallValues = await redisService.readMany(roomCallIds.map(buildActiveRoomCallKey))

  return roomCallValues.filter(isString).map(parseActiveRoomCallState)
}

export const readActiveRoomCallsBySocketId = async (redisService: RedisService, socketId: string) => {
  const roomCallIds = await redisService.readSetValues(buildActiveRoomCallSocketKey(socketId))
  const roomCallValues = await redisService.readMany(roomCallIds.map(buildActiveRoomCallKey))

  return roomCallValues.filter(isString).map(parseActiveRoomCallState)
}

export const readActiveRoomCalls = async (redisService: RedisService) => {
  const roomCallIds = await redisService.readSetValues(ROOM_CALL_ACTIVE_STATE_KEY_PREFIX.ALL)
  const roomCallValues = await redisService.readMany(roomCallIds.map(buildActiveRoomCallKey))

  return roomCallValues.filter(isString).map(parseActiveRoomCallState)
}

export const updateActiveRoomCall = async (
  redisService: RedisService,
  roomCallId: string,
  resolveNextRoomCall: (roomCall: RoomCallActiveState) => RoomCallActiveState | null
) => {
  const activeRoomCallKey = buildActiveRoomCallKey(roomCallId)

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const currentValue = await redisService.read(activeRoomCallKey)

    if (!currentValue) {
      return null
    }

    const currentRoomCall = parseActiveRoomCallState(currentValue)
    const nextRoomCall = resolveNextRoomCall(currentRoomCall)

    if (!nextRoomCall) {
      return null
    }

    const isUpdated = await runRoomCallActiveStateScript(
      redisService,
      ROOM_CALL_ACTIVE_STATE_UPDATE_SCRIPT,
      [activeRoomCallKey, buildActiveRoomCallRoomKey(nextRoomCall.roomId), ROOM_CALL_ACTIVE_STATE_KEY_PREFIX.ALL],
      [currentValue, stringifyActiveRoomCallState(nextRoomCall), String(ROOM_CALL_ACTIVE_STATE_TTL_MS), roomCallId]
    )

    if (isUpdated) {
      await syncActiveRoomCallSocketIndexes(redisService, roomCallId, currentRoomCall, nextRoomCall)
      return nextRoomCall
    }
  }

  throw new Error('Active room call update conflict')
}

export const removeActiveRoomCall = async (redisService: RedisService, roomCall: RoomCallActiveState) => {
  const activeRoomCallKey = buildActiveRoomCallKey(roomCall.id)
  const currentValue = stringifyActiveRoomCallState(roomCall)

  const isRemoved = await runRoomCallActiveStateScript(
    redisService,
    ROOM_CALL_ACTIVE_STATE_REMOVE_SCRIPT,
    [activeRoomCallKey, buildActiveRoomCallRoomKey(roomCall.roomId), ROOM_CALL_ACTIVE_STATE_KEY_PREFIX.ALL],
    [currentValue, roomCall.id]
  )

  if (isRemoved) {
    await Promise.all(
      resolveActiveSocketIds(roomCall).map((socketId) =>
        redisService.removeSetValue(buildActiveRoomCallSocketKey(socketId), roomCall.id)
      )
    )
  }

  return isRemoved
}
