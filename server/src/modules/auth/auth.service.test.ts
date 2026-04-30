import bcrypt from 'bcryptjs'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const envMock = vi.hoisted(() => ({
  SERVER_ENV: {
    domain: '',
    secret: {
      accessTokenSecret: 'access-secret',
      refreshTokenSecret: 'refresh-secret',
      emailConfirmSecret: 'confirm-secret'
    }
  }
}))

const userModelMock = vi.hoisted(() => ({
  updateOne: vi.fn()
}))

const userServiceExportsMock = vi.hoisted(() => ({
  loadGoogleAvatar: vi.fn(),
  updateUserAvatar: vi.fn(),
  UserService: class UserService {}
}))

vi.mock('../../app/env', () => envMock)
vi.mock('../user/user.model', () => ({ UserModel: userModelMock }))
vi.mock('../user/user.service', () => userServiceExportsMock)

const { AuthService } = await import('./auth.service')

const createUser = async (confirmed = true) => ({
  _id: 'user-1',
  id: 'user-1',
  personal: {
    email: 'user@test.com'
  },
  public: {
    nickname: 'tester'
  },
  system: {
    password: await bcrypt.hash('Asdf1234', 6),
    confirmed,
    confirmAttempts: 3,
    device: {} as Record<string, { refreshToken: string; socketId: string }>
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

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('logs in confirmed user and persists refresh token per device', async () => {
    const user = await createUser()
    const response = createResponse()
    const userService = {
      findByLogin: vi.fn().mockResolvedValue(user),
      findById: vi.fn().mockResolvedValue(user),
      mapUserToDto: vi.fn().mockReturnValue({ id: 'user-1', email: 'user@test.com', nickname: 'tester', role: 'user' })
    }
    const service = new AuthService(
      {} as never,
      userService as never,
      {
        assertLoginAllowed: vi.fn(),
        clearLoginFailures: vi.fn(),
        trackLoginFailure: vi.fn()
      } as never
    )

    const result = await service.login(
      { login: '@tester', password: 'Asdf1234' },
      { language: 'en', cookies: { 'device-id': 'device-1' } } as never,
      response as never
    )

    expect(result).toEqual({ id: 'user-1', email: 'user@test.com', nickname: 'tester', role: 'user' })
    expect(response.cookie).toHaveBeenCalledWith('jwt', expect.any(String), expect.objectContaining({ httpOnly: true }))
    expect(response.cookie).toHaveBeenCalledWith(
      'refresh-jwt',
      expect.any(String),
      expect.objectContaining({ httpOnly: true })
    )
    expect(response.cookie).toHaveBeenCalledWith(
      'device-id',
      'device-1',
      expect.objectContaining({ maxAge: 3153600000000 })
    )
    expect(user.system.device['device-1'].refreshToken).toEqual(expect.any(String))
    expect(user.markModified).toHaveBeenCalledWith('system.device')
    expect(user.save).toHaveBeenCalled()
  })

  it('does not issue tokens for unconfirmed user', async () => {
    const user = await createUser(false)
    const response = createResponse()
    const service = new AuthService(
      {} as never,
      {
        findByLogin: vi.fn().mockResolvedValue(user)
      } as never,
      {
        assertLoginAllowed: vi.fn(),
        clearLoginFailures: vi.fn(),
        trackLoginFailure: vi.fn()
      } as never
    )

    await expect(
      service.login(
        { login: 'user@test.com', password: 'Asdf1234' },
        { language: 'en', cookies: {} } as never,
        response as never
      )
    ).rejects.toMatchObject({ status: 400 })
    expect(response.cookie).not.toHaveBeenCalled()
  })

  it('loads provider avatar only for newly created provider users', async () => {
    const user = await createUser()
    const avatar = Buffer.from('avatar')
    const response = createResponse()
    const userService = {
      createUser: vi.fn().mockResolvedValue(user),
      findByEmail: vi.fn(),
      findById: vi.fn().mockResolvedValue(user),
      mapUserToDto: vi.fn().mockReturnValue({ id: 'user-1' })
    }

    userServiceExportsMock.loadGoogleAvatar.mockResolvedValue(avatar)

    const service = new AuthService({} as never, userService as never, {} as never)

    await service.signInWithProvider(
      {
        email: 'user@test.com',
        nickname: 'tester',
        provider: 'google',
        avatar: 'https://lh3.googleusercontent.com/avatar.jpg'
      },
      { language: 'en', cookies: { 'device-id': 'device-1' } } as never,
      response as never
    )

    expect(userService.findByEmail).not.toHaveBeenCalled()
    expect(userServiceExportsMock.loadGoogleAvatar).toHaveBeenCalledWith('https://lh3.googleusercontent.com/avatar.jpg')
    expect(userServiceExportsMock.updateUserAvatar).toHaveBeenCalledWith(avatar, 'user-1', 'en')
  })

  it('returns alreadyConfirmed when email token was already consumed', async () => {
    const user = await createUser()
    const service = new AuthService(
      {} as never,
      {
        findById: vi.fn().mockResolvedValue(user)
      } as never,
      {} as never
    )

    userModelMock.updateOne.mockResolvedValue({ modifiedCount: 0 })

    const result = await service.confirmEmail(
      (await import('jsonwebtoken')).default.sign({ id: 'user-1' }, 'confirm-secret'),
      'en'
    )

    expect(result).toEqual({ email: 'user@test.com', alreadyConfirmed: true })
    expect(userModelMock.updateOne).toHaveBeenCalledWith(
      { _id: 'user-1', 'system.confirmed': { $ne: true } },
      { $set: { 'system.confirmed': true } }
    )
  })

  it('clears auth cookies and removes active device on logout', async () => {
    const user = await createUser()
    const response = createResponse()
    const userService = {
      findById: vi.fn().mockResolvedValue(user)
    }
    const service = new AuthService({} as never, userService as never, {} as never)

    user.system.device = {
      'device-1': {
        refreshToken: 'refresh-token-1',
        socketId: 'socket-1'
      },
      'device-2': {
        refreshToken: 'refresh-token-2',
        socketId: 'socket-2'
      }
    }

    await service.logout(
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
        refreshToken: 'refresh-token-2',
        socketId: 'socket-2'
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
