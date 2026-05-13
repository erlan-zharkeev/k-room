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
    device: {}
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

  it('logs in confirmed user and delegates token update to session service', async () => {
    const user = await createUser()
    const response = createResponse()
    const sessionService = {
      updateTokens: vi.fn()
    }
    const userService = {
      findByLogin: vi.fn().mockResolvedValue(user),
      mapUserToDto: vi.fn().mockReturnValue({ id: 'user-1', email: 'user@test.com', nickname: 'tester', role: 'user' })
    }
    const service = new AuthService(
      {} as never,
      userService as never,
      {
        assertLoginAllowed: vi.fn(),
        clearLoginFailures: vi.fn(),
        trackLoginFailure: vi.fn()
      } as never,
      sessionService as never
    )

    const result = await service.login(
      { login: '@tester', password: 'Asdf1234' },
      { language: 'en', cookies: { 'device-id': 'device-1' } } as never,
      response as never
    )

    expect(result).toEqual({ id: 'user-1', email: 'user@test.com', nickname: 'tester', role: 'user' })
    expect(sessionService.updateTokens).toHaveBeenCalledWith('user-1', expect.any(Object), response)
  })

  it('does not issue tokens for unconfirmed user', async () => {
    const user = await createUser(false)
    const response = createResponse()
    const sessionService = {
      updateTokens: vi.fn()
    }
    const service = new AuthService(
      {} as never,
      {
        findByLogin: vi.fn().mockResolvedValue(user)
      } as never,
      {
        assertLoginAllowed: vi.fn(),
        clearLoginFailures: vi.fn(),
        trackLoginFailure: vi.fn()
      } as never,
      sessionService as never
    )

    await expect(
      service.login(
        { login: 'user@test.com', password: 'Asdf1234' },
        { language: 'en', cookies: {} } as never,
        response as never
      )
    ).rejects.toMatchObject({ status: 400 })
    expect(sessionService.updateTokens).not.toHaveBeenCalled()
  })

  it('loads provider avatar only for newly created provider users', async () => {
    const user = await createUser()
    const avatar = Buffer.from('avatar')
    const response = createResponse()
    const sessionService = {
      updateTokens: vi.fn()
    }
    const userService = {
      createUser: vi.fn().mockResolvedValue(user),
      findByEmail: vi.fn(),
      mapUserToDto: vi.fn().mockReturnValue({ id: 'user-1' })
    }

    userServiceExportsMock.loadGoogleAvatar.mockResolvedValue(avatar)

    const service = new AuthService({} as never, userService as never, {} as never, sessionService as never)

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
    expect(sessionService.updateTokens).toHaveBeenCalledWith('user-1', expect.any(Object), response)
  })

  it('returns alreadyConfirmed when email token was already consumed', async () => {
    const user = await createUser()
    const sessionService = {
      verifyToken: vi.fn().mockResolvedValue({ id: 'user-1' })
    }
    const service = new AuthService(
      {} as never,
      {
        findById: vi.fn().mockResolvedValue(user)
      } as never,
      {} as never,
      sessionService as never
    )

    userModelMock.updateOne.mockResolvedValue({ modifiedCount: 0 })

    const result = await service.confirmEmail('confirm-token', 'en')

    expect(result).toEqual({ email: 'user@test.com', alreadyConfirmed: true })
    expect(sessionService.verifyToken).toHaveBeenCalledWith('confirm-token', 'confirm-secret')
    expect(userModelMock.updateOne).toHaveBeenCalledWith(
      { _id: 'user-1', 'system.confirmed': { $ne: true } },
      { $set: { 'system.confirmed': true } }
    )
  })
})
