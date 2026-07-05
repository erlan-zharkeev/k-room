import { beforeEach, describe, expect, it, vi } from 'vitest'

const envMock = vi.hoisted(() => ({
  SERVER_ENV: {
    domain: '',
    nativeDesktopOrigins: ['http://tauri.localhost', 'https://tauri.localhost', 'tauri://localhost'],
    secret: {
      accessTokenSecret: 'access-secret',
      refreshTokenSecret: 'refresh-secret'
    }
  }
}))

const tokenMock = vi.hoisted(() => ({
  accessToken: 'access-token',
  refreshToken: 'refresh-token'
}))

const userModelMock = vi.hoisted(() => ({
  findOne: vi.fn(),
  updateOne: vi.fn()
}))

vi.mock('../../app/env', () => envMock)
vi.mock('../user/user.model', () => ({ UserModel: userModelMock }))
vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn((_payload: unknown, secret: string) =>
      secret === envMock.SERVER_ENV.secret.accessTokenSecret ? tokenMock.accessToken : tokenMock.refreshToken
    ),
    verify: vi.fn((token: string, _secret: string, callback: (error: unknown, decoded?: unknown) => void) => {
      callback(null, { id: token === tokenMock.refreshToken ? 'user-1' : 'access-user-1' })
    })
  }
}))

const { SessionService } = await import('./session.service')

const createResponse = () => {
  const response = {
    cookie: vi.fn(),
    clearCookie: vi.fn(),
    setHeader: vi.fn()
  }

  response.cookie.mockReturnValue(response)
  response.clearCookie.mockReturnValue(response)

  return response
}

describe('SessionService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    userModelMock.findOne.mockReturnValue({
      select: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue({ _id: 'user-1' })
      })
    })
  })

  it('updates token cookies and stores refresh token for current device', async () => {
    const response = createResponse()
    const service = new SessionService()

    await service.updateTokens(
      'user-1',
      {
        headers: {},
        cookies: {
          'device-id': 'device-1'
        }
      } as never,
      response as never
    )

    expect(response.cookie).toHaveBeenCalledWith('jwt', expect.any(String), expect.objectContaining({ httpOnly: true }))
    expect(response.cookie).toHaveBeenCalledWith(
      'refresh-jwt',
      expect.any(String),
      expect.objectContaining({ httpOnly: true })
    )
    expect(response.cookie).toHaveBeenCalledWith('device-id', 'device-1', expect.objectContaining({ httpOnly: true }))
    expect(userModelMock.updateOne).toHaveBeenCalledWith(
      { _id: 'user-1' },
      {
        $set: {
          'system.device.device-1': {
            refreshToken: expect.any(String)
          }
        }
      }
    )
  })

  it('clears session cookies and removes current device', async () => {
    const response = createResponse()
    const service = new SessionService()

    await service.clearSession(
      'user-1',
      {
        headers: {},
        cookies: {
          'device-id': 'device-1'
        }
      } as never,
      response as never
    )

    expect(userModelMock.updateOne).toHaveBeenCalledWith(
      { _id: 'user-1' },
      {
        $unset: {
          'system.device.device-1': ''
        }
      }
    )
    expect(response.clearCookie).toHaveBeenCalledTimes(3)
    expect(response.clearCookie).toHaveBeenCalledWith(
      'jwt',
      expect.objectContaining({ httpOnly: true, secure: true, sameSite: 'strict', path: '/' })
    )
    expect(response.clearCookie).toHaveBeenCalledWith(
      'refresh-jwt',
      expect.objectContaining({ httpOnly: true, secure: true, sameSite: 'strict', path: '/' })
    )
    expect(response.clearCookie).toHaveBeenCalledWith(
      'device-id',
      expect.objectContaining({ httpOnly: true, secure: true, sameSite: 'strict', path: '/' })
    )
  })

  it('uses cross-site cookies for native desktop requests', async () => {
    const response = createResponse()
    const service = new SessionService()

    await service.updateTokens(
      'user-1',
      {
        headers: {
          origin: 'http://tauri.localhost'
        },
        cookies: {}
      } as never,
      response as never
    )

    expect(response.cookie).toHaveBeenCalledWith(
      'jwt',
      expect.any(String),
      expect.objectContaining({ secure: true, sameSite: 'none' })
    )
    expect(response.cookie).toHaveBeenCalledWith(
      'refresh-jwt',
      expect.any(String),
      expect.objectContaining({ secure: true, sameSite: 'none' })
    )
    expect(response.cookie).toHaveBeenCalledWith(
      'device-id',
      expect.any(String),
      expect.objectContaining({ secure: true, sameSite: 'none' })
    )
  })

  it('uses cross-site cookies for macOS native desktop requests', async () => {
    const response = createResponse()
    const service = new SessionService()

    await service.updateTokens(
      'user-1',
      {
        headers: {
          origin: 'tauri://localhost'
        },
        cookies: {}
      } as never,
      response as never
    )

    expect(response.cookie).toHaveBeenCalledWith(
      'jwt',
      expect.any(String),
      expect.objectContaining({ secure: true, sameSite: 'none' })
    )
    expect(response.cookie).toHaveBeenCalledWith(
      'refresh-jwt',
      expect.any(String),
      expect.objectContaining({ secure: true, sameSite: 'none' })
    )
    expect(response.cookie).toHaveBeenCalledWith(
      'device-id',
      expect.any(String),
      expect.objectContaining({ secure: true, sameSite: 'none' })
    )
  })

  it('returns native auth headers for native desktop requests', async () => {
    const response = createResponse()
    const service = new SessionService()

    await service.updateTokens(
      'user-1',
      {
        headers: {
          origin: 'tauri://localhost',
          'x-k-room-native-client': 'true'
        },
        cookies: {}
      } as never,
      response as never
    )

    expect(response.setHeader).toHaveBeenCalledWith('x-k-room-native-access-token', tokenMock.accessToken)
    expect(response.setHeader).toHaveBeenCalledWith('x-k-room-native-refresh-token', tokenMock.refreshToken)
    expect(response.setHeader).toHaveBeenCalledWith('x-k-room-native-device-id', expect.any(String))
  })

  it('does not return native auth headers for web requests with spoofed native client header', async () => {
    const response = createResponse()
    const service = new SessionService()

    await service.updateTokens(
      'user-1',
      {
        headers: {
          origin: 'https://k-room.space',
          'x-k-room-native-client': 'true'
        },
        cookies: {}
      } as never,
      response as never
    )

    expect(response.setHeader).not.toHaveBeenCalled()
  })

  it('validates refresh sessions from native auth headers', async () => {
    const service = new SessionService()

    await expect(
      service.validateRefreshRequest({
        headers: {
          'x-k-room-native-refresh-token': tokenMock.refreshToken,
          'x-k-room-native-device-id': 'device-1'
        },
        cookies: {}
      } as never)
    ).resolves.toBe('user-1')

    expect(userModelMock.findOne).toHaveBeenCalledWith({
      _id: 'user-1',
      'system.device.device-1.refreshToken': tokenMock.refreshToken
    })
  })
})
