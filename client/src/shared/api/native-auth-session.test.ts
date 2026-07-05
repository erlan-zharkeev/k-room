import { beforeEach, describe, expect, it, vi } from 'vitest'

const browserMock = vi.hoisted(() => ({
  getClientPlatform: vi.fn(() => 'native')
}))

const localStorageMock = vi.hoisted(() => {
  const values = new Map<string, string>()

  return {
    clear: vi.fn(() => values.clear()),
    getItem: vi.fn((key: string) => values.get(key) ?? null),
    removeItem: vi.fn((key: string) => {
      values.delete(key)
    }),
    setItem: vi.fn((key: string, value: string) => {
      values.set(key, value)
    })
  }
})

vi.mock('src/shared/lib', () => browserMock)

const {
  buildNativeAuthRefreshHeaders,
  buildNativeAuthRequestHeaders,
  clearNativeAuthSession,
  readNativeAuthSession,
  syncNativeAuthSessionFromHeaders
} = await import('./native-auth-session')

describe('native-auth-session', () => {
  beforeEach(() => {
    vi.stubGlobal('window', {
      localStorage: localStorageMock
    })
    localStorageMock.clear()
    browserMock.getClientPlatform.mockReturnValue('native')
  })

  it('stores native auth response headers and builds request headers', () => {
    syncNativeAuthSessionFromHeaders({
      'x-k-room-native-access-token': 'access-token',
      'x-k-room-native-refresh-token': 'refresh-token',
      'x-k-room-native-device-id': 'device-1'
    })

    expect(readNativeAuthSession()).toEqual({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      deviceId: 'device-1'
    })
    expect(buildNativeAuthRequestHeaders()).toEqual({
      'x-k-room-native-client': 'true',
      'x-k-room-native-access-token': 'access-token',
      'x-k-room-native-device-id': 'device-1'
    })
    expect(buildNativeAuthRefreshHeaders()).toEqual({
      'x-k-room-native-client': 'true',
      'x-k-room-native-access-token': 'access-token',
      'x-k-room-native-refresh-token': 'refresh-token',
      'x-k-room-native-device-id': 'device-1'
    })
  })

  it('does not expose native auth headers for browser clients', () => {
    browserMock.getClientPlatform.mockReturnValue('browser')

    syncNativeAuthSessionFromHeaders({
      'x-k-room-native-access-token': 'access-token',
      'x-k-room-native-refresh-token': 'refresh-token',
      'x-k-room-native-device-id': 'device-1'
    })

    expect(readNativeAuthSession()).toBeNull()
    expect(buildNativeAuthRequestHeaders()).toEqual({})
  })

  it('clears stored native auth session', () => {
    syncNativeAuthSessionFromHeaders({
      'x-k-room-native-access-token': 'access-token',
      'x-k-room-native-refresh-token': 'refresh-token',
      'x-k-room-native-device-id': 'device-1'
    })

    clearNativeAuthSession()

    expect(readNativeAuthSession()).toBeNull()
  })
})
