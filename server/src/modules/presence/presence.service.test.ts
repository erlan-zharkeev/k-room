import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const presenceUtilsMock = vi.hoisted(() => ({
  buildUserRoomName: vi.fn((userId: string) => `user:${userId}`),
  emitToUsers: vi.fn()
}))

const recipientMock = vi.hoisted(() => ({
  resolveUserRelatedRecipientIds: vi.fn()
}))

const userPersistenceMock = vi.hoisted(() => ({
  updateUserLastSeen: vi.fn()
}))

vi.mock('./presence.utils', () => presenceUtilsMock)
vi.mock('../user/lib/resolve-user-recipient-ids', () => recipientMock)
vi.mock('../user/lib/user-persistence', () => userPersistenceMock)

const { PresenceService } = await import('./presence.service')
const { PRESENCE_ONLINE_USERS_KEY } = await import('./constants')

const createRedisService = () => {
  const values = new Map<string, string>()
  const sets = new Map<string, Set<string>>()
  const ensureSet = (key: string) => {
    const current = sets.get(key) ?? new Set<string>()

    sets.set(key, current)

    return current
  }

  return {
    values,
    sets,
    addSetValue: vi.fn(async (key: string, value: string) => {
      ensureSet(key).add(value)
    }),
    isSetValueExists: vi.fn(async (key: string, value: string) => ensureSet(key).has(value)),
    read: vi.fn(async (key: string) => values.get(key) ?? null),
    readSetValues: vi.fn(async (key: string) => [...ensureSet(key)]),
    refreshTtl: vi.fn(),
    remove: vi.fn(async (key: string) => {
      values.delete(key)
    }),
    removeSetValue: vi.fn(async (key: string, value: string) => {
      ensureSet(key).delete(value)
    }),
    write: vi.fn(async (key: string, value: string) => {
      values.set(key, value)
    }),
    writeOnce: vi.fn(async (key: string, value: string) => {
      if (values.has(key)) return false

      values.set(key, value)

      return true
    })
  }
}

const createSocket = (socketId: string, userId = 'user-1') => ({
  id: socketId,
  data: {
    userId
  },
  join: vi.fn()
})

describe('PresenceService', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
    recipientMock.resolveUserRelatedRecipientIds.mockResolvedValue(['contact-1'])
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('marks first socket online and does not re-emit online status for second socket', async () => {
    const redisService = createRedisService()
    const service = new PresenceService(redisService as never)
    const firstSocket = createSocket('socket-1')
    const secondSocket = createSocket('socket-2')

    await service.markSocketConnected(firstSocket as never)
    await service.markSocketConnected(secondSocket as never)

    expect(firstSocket.join).toHaveBeenCalledWith('user:user-1')
    expect(secondSocket.join).toHaveBeenCalledWith('user:user-1')
    expect(redisService.addSetValue).toHaveBeenCalledWith(PRESENCE_ONLINE_USERS_KEY, 'user-1')
    expect(presenceUtilsMock.emitToUsers).toHaveBeenCalledTimes(1)
    expect(presenceUtilsMock.emitToUsers).toHaveBeenCalledWith(['contact-1'], 'contact-status-updated', {
      interlocutorId: 'user-1',
      online: true,
      onlineStatusUpdatedTimestamp: expect.any(Number)
    })

    service.onModuleDestroy()
  })

  it('keeps user online until the last socket disconnects', async () => {
    const redisService = createRedisService()
    const service = new PresenceService(redisService as never)
    const firstSocket = createSocket('socket-1')
    const secondSocket = createSocket('socket-2')

    vi.setSystemTime(1_000)

    await service.markSocketConnected(firstSocket as never)
    await service.markSocketConnected(secondSocket as never)
    presenceUtilsMock.emitToUsers.mockClear()

    await service.markSocketDisconnected(firstSocket as never)

    expect(userPersistenceMock.updateUserLastSeen).not.toHaveBeenCalled()
    expect(presenceUtilsMock.emitToUsers).not.toHaveBeenCalled()

    await service.markSocketDisconnected(secondSocket as never)

    expect(redisService.removeSetValue).toHaveBeenCalledWith(PRESENCE_ONLINE_USERS_KEY, 'user-1')
    expect(userPersistenceMock.updateUserLastSeen).toHaveBeenCalledWith('user-1', 1_000)
    expect(presenceUtilsMock.emitToUsers).toHaveBeenCalledWith(['contact-1'], 'contact-status-updated', {
      interlocutorId: 'user-1',
      online: false,
      onlineStatusUpdatedTimestamp: 1_000,
      lastSeen: 1_000
    })

    service.onModuleDestroy()
  })

  it('builds online map for unique user ids', async () => {
    const redisService = createRedisService()
    const service = new PresenceService(redisService as never)

    await service.markSocketConnected(createSocket('socket-1', 'user-1') as never)

    const result = await service.onlineMapByUserIds(['user-1', 'user-1', 'user-2'])

    expect(result).toEqual(
      new Map([
        ['user-1', true],
        ['user-2', false]
      ])
    )

    service.onModuleDestroy()
  })
})
