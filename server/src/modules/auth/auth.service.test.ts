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
  UserService: class UserService {}
}))

const googleAvatarMock = vi.hoisted(() => ({
  loadGoogleAvatar: vi.fn()
}))

const userAvatarMock = vi.hoisted(() => ({
  updateUserAvatar: vi.fn()
}))

vi.mock('../../app/env', () => envMock)
vi.mock('../user/user.model', () => ({ UserModel: userModelMock }))
vi.mock('../user/user.service', () => userServiceExportsMock)
vi.mock('../user/lib/load-google-avatar', () => googleAvatarMock)
vi.mock('../user/lib/update-user-avatar', () => userAvatarMock)

const { AuthService } = await import('./auth.service')

const createUser = async (confirmed = true) => ({
  _id: 'user-1',
  id: 'user-1',
  personal: {
    email: 'user@test.com',
    language: 'ru'
  },
  public: {
    avatarId: null,
    nickname: 'tester'
  },
  system: {
    password: await bcrypt.hash('Asdf1234', 6),
    confirmed,
    provider: 'app',
    confirmAttempts: 3,
    device: {}
  },
  markModified: vi.fn(),
  deleteOne: vi.fn(),
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
    userAvatarMock.updateUserAvatar.mockResolvedValue('uploaded-avatar-id')
  })

  it('logs in confirmed user and delegates token update to session service', async () => {
    const user = await createUser()
    const response = createResponse()
    const sessionService = {
      updateTokens: vi.fn()
    }
    const userService = {
      findByLogin: vi.fn().mockResolvedValue(user),
      mapUserToDto: vi.fn().mockReturnValue({
        id: 'user-1',
        email: 'user@test.com',
        nickname: 'tester',
        role: 'user',
        provider: 'app'
      }),
      updateUserLanguage: vi.fn()
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
      { login: 'tester', password: 'Asdf1234' },
      { language: 'en', cookies: { 'device-id': 'device-1' } } as never,
      response as never
    )

    expect(result).toEqual({
      id: 'user-1',
      email: 'user@test.com',
      nickname: 'tester',
      role: 'user',
      provider: 'app'
    })
    expect(sessionService.updateTokens).toHaveBeenCalledWith('user-1', expect.any(Object), response)
    expect(userService.updateUserLanguage).toHaveBeenCalledWith('user-1', 'en')
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
      mapUserToDto: vi.fn().mockReturnValue({ id: 'user-1' }),
      updateUserLanguage: vi.fn()
    }

    googleAvatarMock.loadGoogleAvatar.mockResolvedValue(avatar)

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
    expect(googleAvatarMock.loadGoogleAvatar).toHaveBeenCalledWith('https://lh3.googleusercontent.com/avatar.jpg')
    expect(userAvatarMock.updateUserAvatar).toHaveBeenCalledWith(avatar, null)
    expect(user.public.avatarId).toBe('uploaded-avatar-id')
    expect(user.save).toHaveBeenCalled()
    expect(sessionService.updateTokens).toHaveBeenCalledWith('user-1', expect.any(Object), response)
    expect(userService.updateUserLanguage).toHaveBeenCalledWith('user-1', 'en')
  })

  it('deletes newly created registration user when confirmation email sending fails', async () => {
    const user = await createUser(false)
    const emailError = new Error('resend failed')
    const emailService = {
      sendEmailConfirmationEmail: vi.fn().mockRejectedValue(emailError)
    }
    const userService = {
      findByEmail: vi.fn().mockResolvedValue(null),
      isUserExist: vi.fn().mockResolvedValue({ exists: false, reason: null }),
      createUser: vi.fn().mockResolvedValue(user)
    }
    const sessionService = {
      signToken: vi.fn().mockReturnValue('confirm-token')
    }
    const service = new AuthService(
      emailService as never,
      userService as never,
      {
        assertRegistrationAllowed: vi.fn(),
        trackRegistrationAttempt: vi.fn()
      } as never,
      sessionService as never
    )

    await expect(
      service.registration(
        {
          email: 'user@test.com',
          nickname: 'tester',
          password: 'Asdf1234'
        },
        { headers: {}, ip: '127.0.0.1', language: 'en' } as never
      )
    ).rejects.toBe(emailError)

    expect(user.deleteOne).toHaveBeenCalled()
    expect(userService.createUser).toHaveBeenCalled()
  })

  it('resends confirmation for existing unconfirmed app registration', async () => {
    const user = await createUser(false)
    const emailService = {
      sendEmailConfirmationEmail: vi.fn().mockResolvedValue({ id: 'resend-id' })
    }
    const userService = {
      findByEmail: vi.fn().mockResolvedValue(user),
      isUserExist: vi.fn(),
      createUser: vi.fn(),
      resolveUserLanguage: vi.fn().mockReturnValue('ru')
    }
    const sessionService = {
      signToken: vi.fn().mockReturnValue('confirm-token')
    }
    const service = new AuthService(
      emailService as never,
      userService as never,
      {
        assertRegistrationAllowed: vi.fn(),
        trackRegistrationAttempt: vi.fn()
      } as never,
      sessionService as never
    )

    const result = await service.registration(
      {
        email: 'user@test.com',
        nickname: 'tester',
        password: 'Asdf1234'
      },
      { headers: {}, ip: '127.0.0.1', language: 'en' } as never
    )

    expect(emailService.sendEmailConfirmationEmail).toHaveBeenCalledWith({
      email: 'user@test.com',
      language: 'ru',
      token: 'confirm-token',
      nickname: 'tester'
    })
    expect(user.system.confirmAttempts).toBe(2)
    expect(user.save).toHaveBeenCalled()
    expect(userService.isUserExist).not.toHaveBeenCalled()
    expect(userService.createUser).not.toHaveBeenCalled()
    expect(result).toMatchObject({
      email: 'user@test.com',
      attempts: 2
    })
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

    const result = await service.confirmEmail('confirm-token')

    expect(result).toEqual({ email: 'user@test.com', alreadyConfirmed: true })
    expect(sessionService.verifyToken).toHaveBeenCalledWith('confirm-token', 'confirm-secret')
    expect(userModelMock.updateOne).toHaveBeenCalledWith(
      { _id: 'user-1', 'system.confirmed': { $ne: true } },
      { $set: { 'system.confirmed': true } }
    )
  })
})
