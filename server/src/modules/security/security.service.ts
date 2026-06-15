import { Injectable } from '@nestjs/common'
import {
  PROTECTED_ACTION_REASON,
  REQ_STATUS,
  SECURITY_ACTION,
  type ProtectedActionResponsePayload,
  type ProtectedActionReason,
  type SecurityAction
} from 'global-shared'

import { SERVER_ENV } from 'src/app/env'
import { AppError } from 'src/shared/lib/app-error'

import { CaptchaService } from './captcha.service'
import {
  EMAIL_ACTION_WINDOW_MS,
  LOGIN_BLOCK_ACCOUNT_THRESHOLD,
  LOGIN_BLOCK_IP_THRESHOLD,
  LOGIN_CAPTCHA_ACCOUNT_THRESHOLD,
  LOGIN_CAPTCHA_IP_THRESHOLD,
  LOGIN_FAILURE_WINDOW_MS,
  PASSWORD_RECOVERY_CODE_WINDOW_MS,
  REGISTRATION_BLOCK_IP_THRESHOLD,
  REGISTRATION_CAPTCHA_IP_THRESHOLD,
  REGISTRATION_WINDOW_MS,
  SECURITY_EMAIL_IP_ACTION_LIMITS,
  SECURITY_REDIS_KEY_PREFIX,
  SEND_CONFIRMATION_LINK_COOLDOWN_MS
} from './constants'
import { RedisService } from './redis.service'
import { SECURITY_I18N } from './security.i18n'
import type { SecurityEmailIpActionLimits, SecurityEmailIpActionParams } from './types'

@Injectable()
export class SecurityService {
  constructor(private readonly captchaService: CaptchaService, private readonly redisService: RedisService) {}

  private normalizeKeyPart(value: string) {
    return value.trim().toLowerCase()
  }

  private buildKey(action: SecurityAction, scope: string, value: string) {
    return [SECURITY_REDIS_KEY_PREFIX, action, scope, this.normalizeKeyPart(value)].join(':')
  }

  private buildChangeEmailCodeKey(userId: string) {
    return [SECURITY_REDIS_KEY_PREFIX, SECURITY_ACTION.validateChangeEmailCode, 'code', userId].join(':')
  }

  private buildPasswordRecoveryCodeKey(userId: string) {
    return [SECURITY_REDIS_KEY_PREFIX, SECURITY_ACTION.validatePasswordRecoveryCode, 'code', userId].join(':')
  }

  private buildPasswordRecoveryQueryKey(query: string) {
    return [SECURITY_REDIS_KEY_PREFIX, SECURITY_ACTION.validatePasswordRecoveryCode, 'query', query].join(':')
  }

  private buildPasswordRecoveryUserQueryKey(userId: string) {
    return [SECURITY_REDIS_KEY_PREFIX, SECURITY_ACTION.validatePasswordRecoveryCode, 'user-query', userId].join(':')
  }

  private buildPayload(
    action: SecurityAction,
    reason: ProtectedActionReason,
    nextTryAt?: number
  ): ProtectedActionResponsePayload {
    return {
      action,
      reason,
      captchaAvailable: this.captchaService.isConfigured(),
      ...(nextTryAt ? { nextTryAt } : {})
    }
  }

  private async resolveNextTryAt(keys: string[]) {
    const ttlMsValues = await Promise.all(keys.map((key) => this.redisService.ttlMs(key)))
    const ttlMs = Math.max(...ttlMsValues, 0)

    return ttlMs > 0 ? Date.now() + ttlMs : undefined
  }

  private async resolveActionCooldownUntil(action: SecurityAction, scope: string, value: string) {
    const ttlMs = await this.redisService.ttlMs(this.buildKey(action, scope, value))

    return ttlMs > 0 ? Date.now() + ttlMs : null
  }

  private buildEmailIpActionKeys(action: SecurityAction, email: string, ip: string) {
    return {
      emailKey: this.buildKey(action, 'email', email),
      ipKey: this.buildKey(action, 'ip', ip)
    }
  }

  private async assertEmailIpActionAllowed({ action, email, ip, captchaToken, limits }: SecurityEmailIpActionParams) {
    if (SERVER_ENV.isE2E) return

    const { emailKey, ipKey } = this.buildEmailIpActionKeys(action, email, ip)
    const [emailAttempts, ipAttempts] = await Promise.all([
      this.redisService.readNumber(emailKey),
      this.redisService.readNumber(ipKey)
    ])

    if (emailAttempts >= limits.blockEmailThreshold || ipAttempts >= limits.blockIpThreshold) {
      await this.blockAction(action, [emailKey, ipKey])
    }

    if (emailAttempts >= limits.captchaEmailThreshold || ipAttempts >= limits.captchaIpThreshold) {
      await this.requireCaptcha(action, ip, captchaToken)
    }
  }

  private async trackEmailIpAction(action: SecurityAction, email: string, ip: string, windowMs: number) {
    const { emailKey, ipKey } = this.buildEmailIpActionKeys(action, email, ip)

    await Promise.all([this.redisService.increment(emailKey, windowMs), this.redisService.increment(ipKey, windowMs)])
  }

  private async trackEmailIpFailure(
    action: SecurityAction,
    email: string,
    ip: string,
    windowMs: number,
    limits: SecurityEmailIpActionLimits
  ) {
    const { emailKey, ipKey } = this.buildEmailIpActionKeys(action, email, ip)
    const [emailFailures, ipFailures] = await Promise.all([
      this.redisService.increment(emailKey, windowMs),
      this.redisService.increment(ipKey, windowMs)
    ])

    return {
      blocked: emailFailures >= limits.blockEmailThreshold || ipFailures >= limits.blockIpThreshold
    }
  }

  private async clearEmailIpFailures(action: SecurityAction, email: string) {
    await this.redisService.remove(this.buildKey(action, 'email', email))
  }

  private async requireCaptcha(action: SecurityAction, ip: string, captchaToken?: string) {
    if (!captchaToken) {
      throw new AppError(
        REQ_STATUS.forbidden,
        SECURITY_I18N.captchaRequired,
        false,
        undefined,
        this.buildPayload(action, PROTECTED_ACTION_REASON.captchaRequired)
      )
    }

    const validated = await this.captchaService.validateToken(captchaToken, ip, action)

    if (!validated) {
      throw new AppError(
        REQ_STATUS.forbidden,
        SECURITY_I18N.captchaFailed,
        false,
        undefined,
        this.buildPayload(action, PROTECTED_ACTION_REASON.captchaRequired)
      )
    }
  }

  private async blockAction(action: SecurityAction, keys: string[]) {
    throw new AppError(
      REQ_STATUS.tooManyRequests,
      SECURITY_I18N.temporarilyBlocked,
      false,
      undefined,
      this.buildPayload(action, PROTECTED_ACTION_REASON.temporarilyBlocked, await this.resolveNextTryAt(keys))
    )
  }

  async assertLoginAllowed(ip: string, login: string, captchaToken?: string) {
    if (SERVER_ENV.isE2E) return

    const action = SECURITY_ACTION.login
    const accountKey = this.buildKey(action, 'account', login)
    const ipKey = this.buildKey(action, 'ip', ip)
    const [accountFailures, ipFailures] = await Promise.all([
      this.redisService.readNumber(accountKey),
      this.redisService.readNumber(ipKey)
    ])

    if (accountFailures >= LOGIN_BLOCK_ACCOUNT_THRESHOLD || ipFailures >= LOGIN_BLOCK_IP_THRESHOLD) {
      await this.blockAction(action, [accountKey, ipKey])
    }

    if (accountFailures >= LOGIN_CAPTCHA_ACCOUNT_THRESHOLD || ipFailures >= LOGIN_CAPTCHA_IP_THRESHOLD) {
      await this.requireCaptcha(action, ip, captchaToken)
    }
  }

  async trackLoginFailure(ip: string, login: string) {
    const action = SECURITY_ACTION.login

    await Promise.all([
      this.redisService.increment(this.buildKey(action, 'account', login), LOGIN_FAILURE_WINDOW_MS),
      this.redisService.increment(this.buildKey(action, 'ip', ip), LOGIN_FAILURE_WINDOW_MS)
    ])
  }

  async clearLoginFailures(login: string) {
    await this.redisService.remove(this.buildKey(SECURITY_ACTION.login, 'account', login))
  }

  async assertRegistrationAllowed(ip: string, captchaToken?: string) {
    if (SERVER_ENV.isE2E) return

    const action = SECURITY_ACTION.registration
    const ipKey = this.buildKey(action, 'ip', ip)
    const ipAttempts = await this.redisService.readNumber(ipKey)

    if (ipAttempts >= REGISTRATION_BLOCK_IP_THRESHOLD) {
      await this.blockAction(action, [ipKey])
    }

    if (ipAttempts >= REGISTRATION_CAPTCHA_IP_THRESHOLD) {
      await this.requireCaptcha(action, ip, captchaToken)
    }
  }

  async trackRegistrationAttempt(ip: string) {
    await this.redisService.increment(this.buildKey(SECURITY_ACTION.registration, 'ip', ip), REGISTRATION_WINDOW_MS)
  }

  async getSendConfirmationLinkCooldown(email: string) {
    return this.resolveActionCooldownUntil(SECURITY_ACTION.sendConfirmationLink, 'cooldown', email)
  }

  async assertSendConfirmationLinkAllowed(email: string, ip: string, captchaToken?: string) {
    const action = SECURITY_ACTION.sendConfirmationLink

    await this.assertEmailIpActionAllowed({
      action,
      email,
      ip,
      captchaToken,
      limits: SECURITY_EMAIL_IP_ACTION_LIMITS[action]
    })
  }

  async trackSendConfirmationLinkAttempt(ip: string, email: string) {
    const action = SECURITY_ACTION.sendConfirmationLink

    await Promise.all([
      this.trackEmailIpAction(action, email, ip, EMAIL_ACTION_WINDOW_MS),
      this.redisService.write(this.buildKey(action, 'cooldown', email), '1', SEND_CONFIRMATION_LINK_COOLDOWN_MS)
    ])
  }

  async assertSendPasswordRecoveryAllowed(email: string, ip: string, captchaToken?: string) {
    const action = SECURITY_ACTION.sendPasswordRecoveryCode

    await this.assertEmailIpActionAllowed({
      action,
      email,
      ip,
      captchaToken,
      limits: SECURITY_EMAIL_IP_ACTION_LIMITS[action]
    })
  }

  async trackSendPasswordRecoveryAttempt(ip: string, email: string) {
    await this.trackEmailIpAction(SECURITY_ACTION.sendPasswordRecoveryCode, email, ip, EMAIL_ACTION_WINDOW_MS)
  }

  async getSendPasswordRecoveryCodeCooldown(userId: string) {
    return this.resolveActionCooldownUntil(SECURITY_ACTION.sendPasswordRecoveryCode, 'cooldown', userId)
  }

  private async clearPasswordRecoveryQuery(userId: string) {
    const userQueryKey = this.buildPasswordRecoveryUserQueryKey(userId)
    const query = await this.redisService.read(userQueryKey)
    const keys = [userQueryKey]

    if (query) {
      keys.push(this.buildPasswordRecoveryQueryKey(query))
    }

    await this.redisService.removeMany(keys)
  }

  async getPasswordRecoveryCode(userId: string) {
    return this.redisService.read(this.buildPasswordRecoveryCodeKey(userId))
  }

  async setPasswordRecoveryCode(userId: string, code: string, codeTtlMs: number, cooldownTtlMs: number) {
    await this.clearPasswordRecoveryQuery(userId)
    await Promise.all([
      this.redisService.write(this.buildPasswordRecoveryCodeKey(userId), code, codeTtlMs),
      this.redisService.write(
        this.buildKey(SECURITY_ACTION.sendPasswordRecoveryCode, 'cooldown', userId),
        '1',
        cooldownTtlMs
      )
    ])
  }

  async setPasswordRecoveryQuery(userId: string, query: string, ttlMs: number) {
    await this.clearPasswordRecoveryQuery(userId)
    await Promise.all([
      this.redisService.write(this.buildPasswordRecoveryQueryKey(query), userId, ttlMs),
      this.redisService.write(this.buildPasswordRecoveryUserQueryKey(userId), query, ttlMs)
    ])
  }

  async getPasswordRecoveryQueryUserId(query: string) {
    return this.redisService.read(this.buildPasswordRecoveryQueryKey(query))
  }

  async clearPasswordRecoveryState(userId: string) {
    const userQueryKey = this.buildPasswordRecoveryUserQueryKey(userId)
    const query = await this.redisService.read(userQueryKey)
    const keys = [this.buildPasswordRecoveryCodeKey(userId), userQueryKey]

    if (query) {
      keys.push(this.buildPasswordRecoveryQueryKey(query))
    }

    await this.redisService.removeMany(keys)
  }

  async getSendChangeEmailCodeCooldown(userId: string) {
    return this.resolveActionCooldownUntil(SECURITY_ACTION.sendChangeEmailCode, 'cooldown', userId)
  }

  async assertSendChangeEmailCodeAllowed(email: string, ip: string, captchaToken?: string) {
    const action = SECURITY_ACTION.sendChangeEmailCode

    await this.assertEmailIpActionAllowed({
      action,
      email,
      ip,
      captchaToken,
      limits: SECURITY_EMAIL_IP_ACTION_LIMITS[action]
    })
  }

  async trackSendChangeEmailCodeAttempt(ip: string, email: string, userId: string) {
    const action = SECURITY_ACTION.sendChangeEmailCode

    await Promise.all([
      this.trackEmailIpAction(action, email, ip, EMAIL_ACTION_WINDOW_MS),
      this.redisService.write(this.buildKey(action, 'cooldown', userId), '1', SEND_CONFIRMATION_LINK_COOLDOWN_MS)
    ])
  }

  async assertValidateChangeEmailCodeAllowed(email: string, ip: string, captchaToken?: string) {
    const action = SECURITY_ACTION.validateChangeEmailCode

    await this.assertEmailIpActionAllowed({
      action,
      email,
      ip,
      captchaToken,
      limits: SECURITY_EMAIL_IP_ACTION_LIMITS[action]
    })
  }

  async trackInvalidChangeEmailCode(ip: string, email: string) {
    const action = SECURITY_ACTION.validateChangeEmailCode

    return this.trackEmailIpFailure(
      action,
      email,
      ip,
      PASSWORD_RECOVERY_CODE_WINDOW_MS,
      SECURITY_EMAIL_IP_ACTION_LIMITS[action]
    )
  }

  async clearChangeEmailCodeFailures(email: string) {
    await this.clearEmailIpFailures(SECURITY_ACTION.validateChangeEmailCode, email)
  }

  async getChangeEmailCode(userId: string) {
    return this.redisService.read(this.buildChangeEmailCodeKey(userId))
  }

  async setChangeEmailCode(userId: string, value: string, ttlMs: number) {
    await this.redisService.write(this.buildChangeEmailCodeKey(userId), value, ttlMs)
  }

  async clearChangeEmailCode(userId: string) {
    await this.redisService.remove(this.buildChangeEmailCodeKey(userId))
  }

  async assertValidatePasswordRecoveryCodeAllowed(email: string, ip: string, captchaToken?: string) {
    const action = SECURITY_ACTION.validatePasswordRecoveryCode

    await this.assertEmailIpActionAllowed({
      action,
      email,
      ip,
      captchaToken,
      limits: SECURITY_EMAIL_IP_ACTION_LIMITS[action]
    })
  }

  async trackInvalidPasswordRecoveryCode(ip: string, email: string) {
    const action = SECURITY_ACTION.validatePasswordRecoveryCode

    return this.trackEmailIpFailure(
      action,
      email,
      ip,
      PASSWORD_RECOVERY_CODE_WINDOW_MS,
      SECURITY_EMAIL_IP_ACTION_LIMITS[action]
    )
  }

  async clearPasswordRecoveryCodeFailures(email: string) {
    await this.clearEmailIpFailures(SECURITY_ACTION.validatePasswordRecoveryCode, email)
  }
}
