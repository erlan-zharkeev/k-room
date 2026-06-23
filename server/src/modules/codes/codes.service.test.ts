import type * as Crypto from 'node:crypto'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const cryptoMock = vi.hoisted(() => ({
  randomInt: vi.fn(() => 123456),
  randomUUID: vi.fn(() => 'query-token')
}))

vi.mock('node:crypto', async (importOriginal) => ({
  ...(await importOriginal<typeof Crypto>()),
  randomInt: cryptoMock.randomInt,
  randomUUID: cryptoMock.randomUUID
}))
vi.mock('../../app/env', () => ({
  SERVER_ENV: {
    isDev: true
  }
}))

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

  it('does not resend password recovery code before redis cooldown ends', async () => {
    const emailService = {
      sendPasswordRecoveryEmail: vi.fn()
    }
    const userService = {
      findByEmail: vi.fn().mockResolvedValue({ _id: 'user-1', public: { nickname: 'tester' } }),
      assertCredentialsManagedLocally: vi.fn(),
      resolveUserLanguage: vi.fn().mockReturnValue('ru')
    }
    const securityService = {
      assertSendPasswordRecoveryAllowed: vi.fn(),
      trackSendPasswordRecoveryAttempt: vi.fn(),
      getSendPasswordRecoveryCodeCooldown: vi.fn().mockResolvedValue(200_000),
      setPasswordRecoveryCode: vi.fn()
    }

    const service = new CodesService(emailService as never, userService as never, securityService as never)
    const result = await service.sendPasswordRecoveryCode({ email: 'user@test.com' }, {
      language: 'en',
      headers: {}
    } as never)

    expect(result).toEqual({ nextRequestTime: 200_000, tooManyRequests: true })
    expect(securityService.setPasswordRecoveryCode).not.toHaveBeenCalled()
    expect(emailService.sendPasswordRecoveryEmail).not.toHaveBeenCalled()
  })

  it('stores and sends a new password recovery code with dev debugCode', async () => {
    const emailService = {
      sendPasswordRecoveryEmail: vi.fn()
    }
    const userService = {
      findByEmail: vi.fn().mockResolvedValue({
        _id: 'user-1',
        personal: { language: 'ru' },
        public: { nickname: 'tester' }
      }),
      assertCredentialsManagedLocally: vi.fn(),
      resolveUserLanguage: vi.fn().mockReturnValue('ru')
    }
    const securityService = {
      assertSendPasswordRecoveryAllowed: vi.fn(),
      trackSendPasswordRecoveryAttempt: vi.fn(),
      getSendPasswordRecoveryCodeCooldown: vi.fn().mockResolvedValue(null),
      setPasswordRecoveryCode: vi.fn()
    }

    const service = new CodesService(emailService as never, userService as never, securityService as never)
    const result = await service.sendPasswordRecoveryCode({ email: 'user@test.com' }, {
      language: 'en',
      headers: {}
    } as never)

    expect(result).toEqual({ nextRequestTime: 280_000, debugCode: '123456', tooManyRequests: false })
    expect(securityService.setPasswordRecoveryCode).toHaveBeenCalledWith('user-1', '123456', 900_000, 180_000)
    expect(emailService.sendPasswordRecoveryEmail).toHaveBeenCalledWith({
      email: 'user@test.com',
      language: 'ru',
      code: '123456',
      nickname: 'tester'
    })
  })

  it('rejects password recovery code for provider account', async () => {
    const emailService = {
      sendPasswordRecoveryEmail: vi.fn()
    }
    const userService = {
      findByEmail: vi.fn().mockResolvedValue({ _id: 'user-1', system: { provider: 'google' } }),
      assertCredentialsManagedLocally: vi.fn(() => {
        throw Object.assign(new Error('provider account'), { status: 400 })
      })
    }
    const securityService = {
      assertSendPasswordRecoveryAllowed: vi.fn(),
      trackSendPasswordRecoveryAttempt: vi.fn(),
      getSendPasswordRecoveryCodeCooldown: vi.fn(),
      setPasswordRecoveryCode: vi.fn()
    }

    const service = new CodesService(emailService as never, userService as never, securityService as never)

    await expect(
      service.sendPasswordRecoveryCode({ email: 'user@test.com' }, {
        language: 'en',
        headers: {}
      } as never)
    ).rejects.toMatchObject({ status: 400 })
    expect(securityService.getSendPasswordRecoveryCodeCooldown).not.toHaveBeenCalled()
    expect(securityService.setPasswordRecoveryCode).not.toHaveBeenCalled()
    expect(emailService.sendPasswordRecoveryEmail).not.toHaveBeenCalled()
  })

  it('stores and sends a change email code in redis with dev debugCode', async () => {
    const emailService = {
      sendChangeEmailCodeEmail: vi.fn()
    }
    const userService = {
      requireUser: vi.fn().mockResolvedValue({
        _id: 'user-1',
        personal: { email: 'old@test.com', language: 'zh' },
        public: { nickname: 'tester' }
      }),
      assertCredentialsManagedLocally: vi.fn(),
      findByEmail: vi.fn().mockResolvedValue(null),
      resolveUserLanguage: vi.fn().mockReturnValue('zh')
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
      language: 'zh',
      code: '123456',
      nickname: 'tester'
    })
  })

  it('rejects change email code for provider account', async () => {
    const emailService = {
      sendChangeEmailCodeEmail: vi.fn()
    }
    const userService = {
      requireUser: vi.fn().mockResolvedValue({
        _id: 'user-1',
        system: { provider: 'google' }
      }),
      assertCredentialsManagedLocally: vi.fn(() => {
        throw Object.assign(new Error('provider account'), { status: 400 })
      }),
      findByEmail: vi.fn()
    }
    const securityService = {
      assertSendChangeEmailCodeAllowed: vi.fn(),
      getSendChangeEmailCodeCooldown: vi.fn(),
      trackSendChangeEmailCodeAttempt: vi.fn(),
      setChangeEmailCode: vi.fn()
    }

    const service = new CodesService(emailService as never, userService as never, securityService as never)

    await expect(
      service.sendChangeEmailCode('user-1', { email: 'new@test.com' }, {
        language: 'en',
        headers: {}
      } as never)
    ).rejects.toMatchObject({ status: 400 })
    expect(securityService.getSendChangeEmailCodeCooldown).not.toHaveBeenCalled()
    expect(securityService.setChangeEmailCode).not.toHaveBeenCalled()
    expect(emailService.sendChangeEmailCodeEmail).not.toHaveBeenCalled()
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
    const securityService = {
      assertValidatePasswordRecoveryCodeAllowed: vi.fn(),
      getPasswordRecoveryCode: vi.fn().mockResolvedValue(null),
      trackInvalidPasswordRecoveryCode: vi.fn().mockResolvedValue({ blocked: false }),
      clearPasswordRecoveryState: vi.fn(),
      setPasswordRecoveryQuery: vi.fn(),
      clearPasswordRecoveryCodeFailures: vi.fn()
    }
    const service = new CodesService(
      {} as never,
      {
        findByEmail: vi.fn().mockResolvedValue({ _id: 'user-1' }),
        assertCredentialsManagedLocally: vi.fn()
      } as never,
      securityService as never
    )

    await expect(
      service.validatePasswordRecoveryCode({ email: 'user@test.com', code: '123456' }, {
        language: 'en',
        headers: {}
      } as never)
    ).rejects.toMatchObject({ status: 400 })
    expect(securityService.setPasswordRecoveryQuery).not.toHaveBeenCalled()
  })

  it('converts a valid email code to query token for password reset', async () => {
    const securityService = {
      assertValidatePasswordRecoveryCodeAllowed: vi.fn(),
      getPasswordRecoveryCode: vi.fn().mockResolvedValue('123456'),
      trackInvalidPasswordRecoveryCode: vi.fn(),
      setPasswordRecoveryQuery: vi.fn(),
      clearPasswordRecoveryCodeFailures: vi.fn()
    }
    const service = new CodesService(
      {} as never,
      {
        findByEmail: vi.fn().mockResolvedValue({ _id: 'user-1' }),
        assertCredentialsManagedLocally: vi.fn()
      } as never,
      securityService as never
    )

    const result = await service.validatePasswordRecoveryCode({ email: 'user@test.com', code: '123456' }, {
      language: 'en',
      headers: {}
    } as never)

    expect(result).toEqual({ query: 'query-token' })
    expect(securityService.setPasswordRecoveryQuery).toHaveBeenCalledWith('user-1', 'query-token', 1_200_000)
  })

  it('rejects password recovery code validation for provider account', async () => {
    const securityService = {
      assertValidatePasswordRecoveryCodeAllowed: vi.fn(),
      getPasswordRecoveryCode: vi.fn(),
      setPasswordRecoveryQuery: vi.fn(),
      clearPasswordRecoveryCodeFailures: vi.fn()
    }
    const service = new CodesService(
      {} as never,
      {
        findByEmail: vi.fn().mockResolvedValue({ _id: 'user-1', system: { provider: 'google' } }),
        assertCredentialsManagedLocally: vi.fn(() => {
          throw Object.assign(new Error('provider account'), { status: 400 })
        })
      } as never,
      securityService as never
    )

    await expect(
      service.validatePasswordRecoveryCode({ email: 'user@test.com', code: '123456' }, {
        language: 'en',
        headers: {}
      } as never)
    ).rejects.toMatchObject({ status: 400 })
    expect(securityService.getPasswordRecoveryCode).not.toHaveBeenCalled()
    expect(securityService.setPasswordRecoveryQuery).not.toHaveBeenCalled()
  })
})
