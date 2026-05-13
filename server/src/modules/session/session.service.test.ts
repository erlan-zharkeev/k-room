import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { IUserDevice } from '../user/types'

const envMock = vi.hoisted(() => ({
  SERVER_ENV: {
    domain: '',
    secret: {
      accessTokenSecret: 'access-secret',
      refreshTokenSecret: 'refresh-secret'
    }
  }
}))

const userModelMock = vi.hoisted(() => ({
  findById: vi.fn()
}))

vi.mock('../../app/env', () => envMock)
vi.mock('../user/user.model', () => ({ UserModel: userModelMock }))

const { SessionService } = await import('./session.service')

const createUser = () => ({
  system: {
    device: {} as Record<string, IUserDevice>
  },
  markModified: vi.fn(),
  save: vi.fn()
})

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
    const user = createUser()
    const response = createResponse()
    const service = new SessionService()

    userModelMock.findById.mockResolvedValue(user)

    await service.updateTokens(
      'user-1',
      {
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
    expect(user.system.device['device-1']).toEqual({ refreshToken: expect.any(String) })
    expect(user.markModified).toHaveBeenCalledWith('system.device')
    expect(user.save).toHaveBeenCalled()
  })

  it('clears session cookies and removes current device', async () => {
    const user = createUser()
    const response = createResponse()
    const service = new SessionService()

    user.system.device = {
      'device-1': {
        refreshToken: 'refresh-token-1'
      },
      'device-2': {
        refreshToken: 'refresh-token-2'
      }
    }
    userModelMock.findById.mockResolvedValue(user)

    await service.clearSession(
      'user-1',
      {
        cookies: {
          'device-id': 'device-1'
        }
      } as never,
      response as never
    )

    expect(user.system.device).toEqual({
      'device-2': {
        refreshToken: 'refresh-token-2'
      }
    })
    expect(user.markModified).toHaveBeenCalledWith('system.device')
    expect(user.save).toHaveBeenCalled()
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
})
