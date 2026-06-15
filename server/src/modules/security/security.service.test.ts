import { PROTECTED_ACTION_REASON, REQ_STATUS, SECURITY_ACTION } from 'global-shared'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { AppError } from 'src/shared/lib/app-error'

import {
  LOGIN_BLOCK_ACCOUNT_THRESHOLD,
  LOGIN_CAPTCHA_ACCOUNT_THRESHOLD,
  LOGIN_FAILURE_WINDOW_MS,
  PASSWORD_RECOVERY_CODE_WINDOW_MS,
  SEND_CONFIRMATION_LINK_COOLDOWN_MS
} from './constants'
import { SecurityService } from './security.service'

const createSecurityService = () => {
  const captchaService = {
    isConfigured: vi.fn(() => true),
    validateToken: vi.fn().mockResolvedValue(true)
  }
  const redisService = {
    read: vi.fn(),
    readNumber: vi.fn().mockResolvedValue(0),
    ttlMs: vi.fn().mockResolvedValue(0),
    increment: vi.fn(),
    write: vi.fn(),
    writeOnce: vi.fn(),
    remove: vi.fn(),
    removeMany: vi.fn()
  }

  return {
    captchaService,
    redisService,
    service: new SecurityService(captchaService as never, redisService as never)
  }
}

describe('SecurityService', () => {
  beforeEach(() => {
    vi.useRealTimers()
  })

  it('requires captcha when login failures reach captcha threshold', async () => {
    const { captchaService, redisService, service } = createSecurityService()

    redisService.readNumber.mockResolvedValueOnce(LOGIN_CAPTCHA_ACCOUNT_THRESHOLD).mockResolvedValueOnce(0)

    await expect(service.assertLoginAllowed('127.0.0.1', ' Tester ')).rejects.toMatchObject({
      status: REQ_STATUS.forbidden,
      payload: {
        action: SECURITY_ACTION.login,
        reason: PROTECTED_ACTION_REASON.captchaRequired,
        captchaAvailable: true
      }
    })
    expect(captchaService.validateToken).not.toHaveBeenCalled()

    redisService.readNumber.mockResolvedValueOnce(LOGIN_CAPTCHA_ACCOUNT_THRESHOLD).mockResolvedValueOnce(0)

    await service.assertLoginAllowed('127.0.0.1', ' Tester ', 'captcha-token')

    expect(captchaService.validateToken).toHaveBeenCalledWith('captcha-token', '127.0.0.1', SECURITY_ACTION.login)
  })

  it('blocks login when account failures reach block threshold', async () => {
    const { redisService, service } = createSecurityService()

    vi.useFakeTimers()
    vi.setSystemTime(10_000)
    redisService.readNumber.mockResolvedValueOnce(LOGIN_BLOCK_ACCOUNT_THRESHOLD).mockResolvedValueOnce(0)
    redisService.ttlMs.mockResolvedValueOnce(5_000).mockResolvedValueOnce(1_000)

    await expect(service.assertLoginAllowed('127.0.0.1', 'tester')).rejects.toMatchObject({
      status: REQ_STATUS.tooManyRequests,
      payload: {
        action: SECURITY_ACTION.login,
        reason: PROTECTED_ACTION_REASON.temporarilyBlocked,
        nextTryAt: 15_000
      }
    })
  })

  it('tracks and clears normalized login failures', async () => {
    const { redisService, service } = createSecurityService()

    await service.trackLoginFailure('127.0.0.1', ' Tester ')
    await service.clearLoginFailures(' Tester ')

    expect(redisService.increment).toHaveBeenCalledWith('security:login:account:tester', LOGIN_FAILURE_WINDOW_MS)
    expect(redisService.increment).toHaveBeenCalledWith('security:login:ip:127.0.0.1', LOGIN_FAILURE_WINDOW_MS)
    expect(redisService.remove).toHaveBeenCalledWith('security:login:account:tester')
  })

  it('replaces password recovery query keys atomically enough for one active reset query', async () => {
    const { redisService, service } = createSecurityService()

    redisService.read.mockResolvedValueOnce('old-query')

    await service.setPasswordRecoveryQuery('user-1', 'new-query', PASSWORD_RECOVERY_CODE_WINDOW_MS)

    expect(redisService.removeMany).toHaveBeenCalledWith([
      'security:validate-password-recovery-code:user-query:user-1',
      'security:validate-password-recovery-code:query:old-query'
    ])
    expect(redisService.write).toHaveBeenCalledWith(
      'security:validate-password-recovery-code:query:new-query',
      'user-1',
      PASSWORD_RECOVERY_CODE_WINDOW_MS
    )
    expect(redisService.write).toHaveBeenCalledWith(
      'security:validate-password-recovery-code:user-query:user-1',
      'new-query',
      PASSWORD_RECOVERY_CODE_WINDOW_MS
    )
  })

  it('clears password recovery code, user query, and active query token', async () => {
    const { redisService, service } = createSecurityService()

    redisService.read.mockResolvedValueOnce('query-token')

    await service.clearPasswordRecoveryState('user-1')

    expect(redisService.removeMany).toHaveBeenCalledWith([
      'security:validate-password-recovery-code:code:user-1',
      'security:validate-password-recovery-code:user-query:user-1',
      'security:validate-password-recovery-code:query:query-token'
    ])
  })

  it('stores email action cooldowns by user when change email code is sent', async () => {
    const { redisService, service } = createSecurityService()

    redisService.increment.mockResolvedValue(1)

    await service.trackSendChangeEmailCodeAttempt('127.0.0.1', 'New@Test.Com', 'user-1')

    expect(redisService.increment).toHaveBeenCalledWith(
      'security:send-change-email-code:email:new@test.com',
      expect.any(Number)
    )
    expect(redisService.write).toHaveBeenCalledWith(
      'security:send-change-email-code:cooldown:user-1',
      '1',
      SEND_CONFIRMATION_LINK_COOLDOWN_MS
    )
  })

  it('returns invalid code tracking result from email and ip failure counters', async () => {
    const { redisService, service } = createSecurityService()

    redisService.increment.mockResolvedValueOnce(1).mockResolvedValueOnce(20)

    const result = await service.trackInvalidPasswordRecoveryCode('127.0.0.1', 'user@test.com')

    expect(result).toEqual({ blocked: true })
  })

  it('throws AppError payloads for failed captcha validation', async () => {
    const { captchaService, redisService, service } = createSecurityService()

    captchaService.validateToken.mockResolvedValue(false)
    redisService.readNumber.mockResolvedValueOnce(LOGIN_CAPTCHA_ACCOUNT_THRESHOLD).mockResolvedValueOnce(0)

    await expect(service.assertLoginAllowed('127.0.0.1', 'tester', 'bad-token')).rejects.toBeInstanceOf(AppError)
  })
})
