import { HOUR_IN_MS } from 'global-shared'

export const ROOM_CALL_ACTIVE_STATE_TTL_MS = 12 * HOUR_IN_MS

export const ROOM_CALL_DECLINE_STATE_TTL_MS = 12 * HOUR_IN_MS

export const ROOM_CALL_SERVER_INSTANCE_HEARTBEAT_TTL_MS = 15_000

export const ROOM_CALL_SERVER_INSTANCE_HEARTBEAT_INTERVAL_MS = 5_000

export const ROOM_CALL_STALE_PARTICIPANT_CLEANUP_INTERVAL_MS = 10_000

export const ROOM_CALL_ACTIVE_STATE_KEY_PREFIX = {
  ALL: 'room-call:active:all',
  CALL: 'room-call:active:call',
  ROOM: 'room-call:active:room',
  SERVER_INSTANCE: 'room-call:server-instance',
  SOCKET: 'room-call:active:socket'
} as const

export const ROOM_CALL_ACTIVE_STATE_CREATE_SCRIPT = `
  if redis.call('exists', KEYS[1]) == 1 then
    return 0
  end

  redis.call('psetex', KEYS[1], ARGV[3], ARGV[1])
  redis.call('psetex', KEYS[2], ARGV[3], ARGV[2])
  redis.call('sadd', KEYS[3], ARGV[1])
  redis.call('pexpire', KEYS[3], ARGV[3])
  redis.call('sadd', KEYS[4], ARGV[1])
  redis.call('pexpire', KEYS[4], ARGV[3])

  return 1
`

export const ROOM_CALL_ACTIVE_STATE_UPDATE_SCRIPT = `
  if redis.call('get', KEYS[1]) ~= ARGV[1] then
    return 0
  end

  redis.call('psetex', KEYS[1], ARGV[3], ARGV[2])
  redis.call('psetex', KEYS[2], ARGV[3], ARGV[4])
  redis.call('sadd', KEYS[3], ARGV[4])
  redis.call('pexpire', KEYS[3], ARGV[3])

  return 1
`

export const ROOM_CALL_ACTIVE_STATE_REMOVE_SCRIPT = `
  if redis.call('get', KEYS[1]) ~= ARGV[1] then
    return 0
  end

  redis.call('del', KEYS[1])
  redis.call('del', KEYS[2])
  redis.call('srem', KEYS[3], ARGV[2])

  return 1
`
