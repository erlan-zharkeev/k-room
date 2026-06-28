import { beforeEach, describe, expect, it, vi } from 'vitest'

const envMock = vi.hoisted(() => ({
  SERVER_ENV: {
    domain: '',
    nativeDesktopOrigins: ['http://tauri.localhost'],
    secret: {
      accessTokenSecret: 'access-secret',
      refreshTokenSecret: 'refresh-secret'
    }
  }
}))

const userModelMock = vi.hoisted(() => ({
  findOne: vi.fn(),
  updateOne: vi.fn()
}))

vi.mock('../../app/env', () => envMock)
vi.mock('../user/user.model', () => ({ UserModel: userModelMock }))

const { SessionService } = await import('./session.service')

const createResponse = () => {
  const response = {
    cookie: vi.fn(),
    clearCookie: vi.fn()
  }

  response.cookie.mockReturnValue(response)
  response.clearCookie.mockReturnValue(response)

  return response
}

describe('SessionService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
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
})
