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

    expect(result).toEqual({ nextTimeRequest: 200_000, tooManyRequests: true })
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

    expect(result).toEqual({ nextTimeRequest: 280_000, debugCode: '123456', tooManyRequests: false })
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
      language: 'en',
      nickname: '@tester'
    })
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
