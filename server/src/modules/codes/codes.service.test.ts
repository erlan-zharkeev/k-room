import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const cryptoMock = vi.hoisted(() => ({
  randomInt: vi.fn(() => 123456),
  randomUUID: vi.fn(() => 'query-token')
}))

const codeModelMock = vi.hoisted(() => ({
  findById: vi.fn(),
  updateOne: vi.fn()
}))

vi.mock('node:crypto', async (importOriginal) => ({
  ...(await importOriginal<typeof import('node:crypto')>()),
  randomInt: cryptoMock.randomInt,
  randomUUID: cryptoMock.randomUUID
}))
vi.mock('../../app/env', () => ({
  SERVER_ENV: {
    isDev: true
  }
}))
vi.mock('./codes.model', () => ({ CodeModel: codeModelMock }))

const { CodesService } = await import('./codes.service')

describe('CodesService', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(100_000))
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('does not resend password recovery code before nextRequestPossibleAt', async () => {
    const emailService = {
      sendPasswordRecoveryEmail: vi.fn()
    }
    const userService = {
      findByEmail: vi.fn().mockResolvedValue({ _id: 'user-1', public: { nickname: 'tester' } })
    }

    codeModelMock.findById.mockResolvedValue({ nextRequestPossibleAt: 200_000 })

    const service = new CodesService(
      emailService as never,
      userService as never,
      {
        assertSendPasswordRecoveryAllowed: vi.fn(),
        trackSendPasswordRecoveryAttempt: vi.fn()
      } as never
    )
    const result = await service.sendPasswordRecoveryCode({ email: 'user@test.com' }, {
      language: 'en',
      headers: {}
    } as never)

    expect(result).toEqual({ nextRequestTime: 200_000, tooManyRequests: true })
    expect(codeModelMock.updateOne).not.toHaveBeenCalled()
    expect(emailService.sendPasswordRecoveryEmail).not.toHaveBeenCalled()
  })

  it('stores and sends a new password recovery code with dev debugCode', async () => {
    const emailService = {
      sendPasswordRecoveryEmail: vi.fn()
    }
    const userService = {
      findByEmail: vi.fn().mockResolvedValue({
        _id: 'user-1',
        public: { nickname: 'tester' }
      })
    }

    codeModelMock.findById.mockResolvedValue(null)

    const service = new CodesService(
      emailService as never,
      userService as never,
      {
        assertSendPasswordRecoveryAllowed: vi.fn(),
        trackSendPasswordRecoveryAttempt: vi.fn()
      } as never
    )
    const result = await service.sendPasswordRecoveryCode({ email: 'user@test.com' }, {
      language: 'en',
      headers: {}
    } as never)

    expect(result).toEqual({ nextRequestTime: 280_000, debugCode: '123456', tooManyRequests: false })
    expect(codeModelMock.updateOne).toHaveBeenCalledWith(
      { _id: 'user-1' },
      {
        $set: {
          'codes.passwordRecovery.email.value': '123456',
          'codes.passwordRecovery.email.expiresAt': 1_000_000,
          'codes.passwordRecovery.query.value': '',
          'codes.passwordRecovery.query.expiresAt': 0,
          nextRequestPossibleAt: 280_000
        }
      },
      { upsert: true }
    )
    expect(emailService.sendPasswordRecoveryEmail).toHaveBeenCalledWith({
      email: 'user@test.com',
      code: '123456',
      nickname: 'tester'
    })
  })

  it('stores and sends a change email code in redis with dev debugCode', async () => {
    const emailService = {
      sendChangeEmailCodeEmail: vi.fn()
    }
    const userService = {
      requireUser: vi.fn().mockResolvedValue({
        _id: 'user-1',
        personal: { email: 'old@test.com' },
        public: { nickname: 'tester' }
      }),
      findByEmail: vi.fn().mockResolvedValue(null)
    }
    const securityService = {
      assertSendChangeEmailCodeAllowed: vi.fn(),
      getSendChangeEmailCodeCooldown: vi.fn().mockResolvedValue(null),
      trackSendChangeEmailCodeAttempt: vi.fn(),
      setChangeEmailCode: vi.fn()
    }

    const service = new CodesService(emailService as never, userService as never, securityService as never)
    const result = await service.sendChangeEmailCode('user-1', { email: 'new@test.com' }, {
      language: 'en',
      headers: {}
    } as never)

    expect(result).toEqual({ nextRequestTime: 280_000, debugCode: '123456', tooManyRequests: false })
    expect(securityService.setChangeEmailCode).toHaveBeenCalledWith(
      'user-1',
      JSON.stringify({ email: 'new@test.com', code: '123456' }),
      900_000
    )
    expect(emailService.sendChangeEmailCodeEmail).toHaveBeenCalledWith({
      email: 'new@test.com',
      code: '123456',
      nickname: 'tester'
    })
  })

  it('validates a change email code from redis and updates user email', async () => {
    const userService = {
      changeEmail: vi.fn()
    }
    const securityService = {
      assertValidateChangeEmailCodeAllowed: vi.fn(),
      getChangeEmailCode: vi.fn().mockResolvedValue(JSON.stringify({ email: 'new@test.com', code: '123456' })),
      clearChangeEmailCode: vi.fn(),
      clearChangeEmailCodeFailures: vi.fn(),
      trackInvalidChangeEmailCode: vi.fn()
    }

    const service = new CodesService({} as never, userService as never, securityService as never)
    const result = await service.validateChangeEmailCode('user-1', { email: 'new@test.com', code: '123456' }, {
      language: 'en',
      headers: {}
    } as never)

    expect(result).toEqual({ email: 'new@test.com' })
    expect(userService.changeEmail).toHaveBeenCalledWith({
      userId: 'user-1',
      email: 'new@test.com'
    })
    expect(securityService.clearChangeEmailCode).toHaveBeenCalledWith('user-1')
    expect(securityService.clearChangeEmailCodeFailures).toHaveBeenCalledWith('new@test.com')
  })

  it('rejects expired password recovery code without creating query token', async () => {
    const updateOne = vi.fn()
    const service = new CodesService(
      {} as never,
      {
        findByEmail: vi.fn().mockResolvedValue({ _id: 'user-1' })
      } as never,
      {
        assertValidatePasswordRecoveryCodeAllowed: vi.fn(),
        clearPasswordRecoveryCodeFailures: vi.fn(),
        trackInvalidPasswordRecoveryCode: vi.fn()
      } as never
    )

    codeModelMock.findById.mockResolvedValue({
      codes: {
        passwordRecovery: {
          email: {
            value: '123456',
            expiresAt: 99_999
          }
        }
      },
      updateOne
    })

    await expect(
      service.validatePasswordRecoveryCode({ email: 'user@test.com', code: '123456' }, {
        language: 'en',
        headers: {}
      } as never)
    ).rejects.toMatchObject({ status: 400 })
    expect(updateOne).not.toHaveBeenCalled()
  })

  it('converts a valid email code to query token for password reset', async () => {
    const updateOne = vi.fn()
    const service = new CodesService(
      {} as never,
      {
        findByEmail: vi.fn().mockResolvedValue({ _id: 'user-1' })
      } as never,
      {
        assertValidatePasswordRecoveryCodeAllowed: vi.fn(),
        clearPasswordRecoveryCodeFailures: vi.fn(),
        trackInvalidPasswordRecoveryCode: vi.fn()
      } as never
    )

    codeModelMock.findById.mockResolvedValue({
      codes: {
        passwordRecovery: {
          email: {
            value: '123456',
            expiresAt: 100_001
          }
        }
      },
      updateOne
    })

    const result = await service.validatePasswordRecoveryCode({ email: 'user@test.com', code: '123456' }, {
      language: 'en',
      headers: {}
    } as never)

    expect(result).toEqual({ query: 'query-token' })
    expect(updateOne).toHaveBeenCalledWith({
      $set: {
        'codes.passwordRecovery.query.value': 'query-token',
        'codes.passwordRecovery.query.expiresAt': 1_300_000
      }
    })
  })
})
