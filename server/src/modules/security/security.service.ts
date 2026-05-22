import { Injectable } from '@nestjs/common'
import {
  REQ_STATUS,
  SECURITY_ACTION,
  type ProtectedActionResponsePayload,
  type ProtectedActionReason,
  type SecurityAction
} from 'global-shared'

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
  SECURITY_BLOCK_REASON,
  SECURITY_CAPTCHA_REASON,
  SECURITY_REDIS_KEY_PREFIX,
  SEND_CONFIRMATION_LINK_BLOCK_EMAIL_THRESHOLD,
  SEND_CONFIRMATION_LINK_BLOCK_IP_THRESHOLD,
  SEND_CONFIRMATION_LINK_CAPTCHA_EMAIL_THRESHOLD,
  SEND_CONFIRMATION_LINK_CAPTCHA_IP_THRESHOLD,
  SEND_CONFIRMATION_LINK_COOLDOWN_MS,
  SEND_CHANGE_EMAIL_BLOCK_EMAIL_THRESHOLD,
  SEND_CHANGE_EMAIL_BLOCK_IP_THRESHOLD,
  SEND_CHANGE_EMAIL_CAPTCHA_EMAIL_THRESHOLD,
  SEND_CHANGE_EMAIL_CAPTCHA_IP_THRESHOLD,
  SEND_PASSWORD_RECOVERY_BLOCK_EMAIL_THRESHOLD,
  SEND_PASSWORD_RECOVERY_BLOCK_IP_THRESHOLD,
  SEND_PASSWORD_RECOVERY_CAPTCHA_EMAIL_THRESHOLD,
  SEND_PASSWORD_RECOVERY_CAPTCHA_IP_THRESHOLD,
  VALIDATE_CHANGE_EMAIL_BLOCK_EMAIL_THRESHOLD,
  VALIDATE_CHANGE_EMAIL_BLOCK_IP_THRESHOLD,
  VALIDATE_CHANGE_EMAIL_CAPTCHA_EMAIL_THRESHOLD,
  VALIDATE_CHANGE_EMAIL_CAPTCHA_IP_THRESHOLD,
  VALIDATE_PASSWORD_RECOVERY_BLOCK_EMAIL_THRESHOLD,
  VALIDATE_PASSWORD_RECOVERY_BLOCK_IP_THRESHOLD,
  VALIDATE_PASSWORD_RECOVERY_CAPTCHA_EMAIL_THRESHOLD,
  VALIDATE_PASSWORD_RECOVERY_CAPTCHA_IP_THRESHOLD
} from './constants'
import { RedisService } from './redis.service'
import { SECURITY_I18N } from './security.i18n'

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

  private async getNextTryAt(keys: string[]) {
    const ttlMsValues = await Promise.all(keys.map((key) => this.redisService.ttlMs(key)))
    const ttlMs = Math.max(...ttlMsValues, 0)

    return ttlMs > 0 ? Date.now() + ttlMs : undefined
  }

  private async requireCaptcha(action: SecurityAction, ip: string, captchaToken?: string) {
    if (!captchaToken) {
      throw new AppError(
        REQ_STATUS.forbidden,
        SECURITY_I18N.captchaRequired,
        false,
        undefined,
        this.buildPayload(action, SECURITY_CAPTCHA_REASON)
      )
    }

    const validated = await this.captchaService.validateToken(captchaToken, ip, action)

    if (!validated) {
      throw new AppError(
        REQ_STATUS.forbidden,
        SECURITY_I18N.captchaFailed,
        false,
        undefined,
        this.buildPayload(action, SECURITY_CAPTCHA_REASON)
      )
    }
  }

  private async blockAction(action: SecurityAction, keys: string[]) {
    throw new AppError(
      REQ_STATUS.tooManyRequests,
      SECURITY_I18N.temporarilyBlocked,
      false,
      undefined,
      this.buildPayload(action, SECURITY_BLOCK_REASON, await this.getNextTryAt(keys))
    )
  }

  async assertLoginAllowed(ip: string, login: string, captchaToken?: string) {
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
    const cooldownKey = this.buildKey(SECURITY_ACTION.sendConfirmationLink, 'cooldown', email)
    const ttlMs = await this.redisService.ttlMs(cooldownKey)

    return ttlMs > 0 ? Date.now() + ttlMs : null
  }

  async assertSendConfirmationLinkAllowed(email: string, ip: string, captchaToken?: string) {
    const action = SECURITY_ACTION.sendConfirmationLink
    const emailKey = this.buildKey(action, 'email', email)
    const ipKey = this.buildKey(action, 'ip', ip)
    const [emailAttempts, ipAttempts] = await Promise.all([
      this.redisService.readNumber(emailKey),
      this.redisService.readNumber(ipKey)
    ])

    if (
      emailAttempts >= SEND_CONFIRMATION_LINK_BLOCK_EMAIL_THRESHOLD ||
      ipAttempts >= SEND_CONFIRMATION_LINK_BLOCK_IP_THRESHOLD
    ) {
      await this.blockAction(action, [emailKey, ipKey])
    }

    if (
      emailAttempts >= SEND_CONFIRMATION_LINK_CAPTCHA_EMAIL_THRESHOLD ||
      ipAttempts >= SEND_CONFIRMATION_LINK_CAPTCHA_IP_THRESHOLD
    ) {
      await this.requireCaptcha(action, ip, captchaToken)
    }
  }

  async trackSendConfirmationLinkAttempt(ip: string, email: string) {
    const action = SECURITY_ACTION.sendConfirmationLink

    await Promise.all([
      this.redisService.increment(this.buildKey(action, 'email', email), EMAIL_ACTION_WINDOW_MS),
      this.redisService.increment(this.buildKey(action, 'ip', ip), EMAIL_ACTION_WINDOW_MS),
      this.redisService.write(this.buildKey(action, 'cooldown', email), '1', SEND_CONFIRMATION_LINK_COOLDOWN_MS)
    ])
  }

  async assertSendPasswordRecoveryAllowed(email: string, ip: string, captchaToken?: string) {
    const action = SECURITY_ACTION.sendPasswordRecoveryCode
    const emailKey = this.buildKey(action, 'email', email)
    const ipKey = this.buildKey(action, 'ip', ip)
    const [emailAttempts, ipAttempts] = await Promise.all([
      this.redisService.readNumber(emailKey),
      this.redisService.readNumber(ipKey)
    ])

    if (
      emailAttempts >= SEND_PASSWORD_RECOVERY_BLOCK_EMAIL_THRESHOLD ||
      ipAttempts >= SEND_PASSWORD_RECOVERY_BLOCK_IP_THRESHOLD
    ) {
      await this.blockAction(action, [emailKey, ipKey])
    }

    if (
      emailAttempts >= SEND_PASSWORD_RECOVERY_CAPTCHA_EMAIL_THRESHOLD ||
      ipAttempts >= SEND_PASSWORD_RECOVERY_CAPTCHA_IP_THRESHOLD
    ) {
      await this.requireCaptcha(action, ip, captchaToken)
    }
  }

  async trackSendPasswordRecoveryAttempt(ip: string, email: string) {
    const action = SECURITY_ACTION.sendPasswordRecoveryCode

    await Promise.all([
      this.redisService.increment(this.buildKey(action, 'email', email), EMAIL_ACTION_WINDOW_MS),
      this.redisService.increment(this.buildKey(action, 'ip', ip), EMAIL_ACTION_WINDOW_MS)
    ])
  }

  async getSendChangeEmailCodeCooldown(userId: string) {
    const cooldownKey = this.buildKey(SECURITY_ACTION.sendChangeEmailCode, 'cooldown', userId)
    const ttlMs = await this.redisService.ttlMs(cooldownKey)

    return ttlMs > 0 ? Date.now() + ttlMs : null
  }

  async assertSendChangeEmailCodeAllowed(email: string, ip: string, captchaToken?: string) {
    const action = SECURITY_ACTION.sendChangeEmailCode
    const emailKey = this.buildKey(action, 'email', email)
    const ipKey = this.buildKey(action, 'ip', ip)
    const [emailAttempts, ipAttempts] = await Promise.all([
      this.redisService.readNumber(emailKey),
      this.redisService.readNumber(ipKey)
    ])

    if (
      emailAttempts >= SEND_CHANGE_EMAIL_BLOCK_EMAIL_THRESHOLD ||
      ipAttempts >= SEND_CHANGE_EMAIL_BLOCK_IP_THRESHOLD
    ) {
      await this.blockAction(action, [emailKey, ipKey])
    }

    if (
      emailAttempts >= SEND_CHANGE_EMAIL_CAPTCHA_EMAIL_THRESHOLD ||
      ipAttempts >= SEND_CHANGE_EMAIL_CAPTCHA_IP_THRESHOLD
    ) {
      await this.requireCaptcha(action, ip, captchaToken)
    }
  }

  async trackSendChangeEmailCodeAttempt(ip: string, email: string, userId: string) {
    const action = SECURITY_ACTION.sendChangeEmailCode

    await Promise.all([
      this.redisService.increment(this.buildKey(action, 'email', email), EMAIL_ACTION_WINDOW_MS),
      this.redisService.increment(this.buildKey(action, 'ip', ip), EMAIL_ACTION_WINDOW_MS),
      this.redisService.write(this.buildKey(action, 'cooldown', userId), '1', SEND_CONFIRMATION_LINK_COOLDOWN_MS)
    ])
  }

  async assertValidateChangeEmailCodeAllowed(email: string, ip: string, captchaToken?: string) {
    const action = SECURITY_ACTION.validateChangeEmailCode
    const emailKey = this.buildKey(action, 'email', email)
    const ipKey = this.buildKey(action, 'ip', ip)
    const [emailFailures, ipFailures] = await Promise.all([
      this.redisService.readNumber(emailKey),
      this.redisService.readNumber(ipKey)
    ])

    if (
      emailFailures >= VALIDATE_CHANGE_EMAIL_BLOCK_EMAIL_THRESHOLD ||
      ipFailures >= VALIDATE_CHANGE_EMAIL_BLOCK_IP_THRESHOLD
    ) {
      await this.blockAction(action, [emailKey, ipKey])
    }

    if (
      emailFailures >= VALIDATE_CHANGE_EMAIL_CAPTCHA_EMAIL_THRESHOLD ||
      ipFailures >= VALIDATE_CHANGE_EMAIL_CAPTCHA_IP_THRESHOLD
    ) {
      await this.requireCaptcha(action, ip, captchaToken)
    }
  }

  async trackInvalidChangeEmailCode(ip: string, email: string) {
    const action = SECURITY_ACTION.validateChangeEmailCode
    const [emailFailures, ipFailures] = await Promise.all([
      this.redisService.increment(this.buildKey(action, 'email', email), PASSWORD_RECOVERY_CODE_WINDOW_MS),
      this.redisService.increment(this.buildKey(action, 'ip', ip), PASSWORD_RECOVERY_CODE_WINDOW_MS)
    ])

    return {
      blocked:
        emailFailures >= VALIDATE_CHANGE_EMAIL_BLOCK_EMAIL_THRESHOLD ||
        ipFailures >= VALIDATE_CHANGE_EMAIL_BLOCK_IP_THRESHOLD
    }
  }

  async clearChangeEmailCodeFailures(email: string) {
    await this.redisService.remove(this.buildKey(SECURITY_ACTION.validateChangeEmailCode, 'email', email))
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
    const emailKey = this.buildKey(action, 'email', email)
    const ipKey = this.buildKey(action, 'ip', ip)
    const [emailFailures, ipFailures] = await Promise.all([
      this.redisService.readNumber(emailKey),
      this.redisService.readNumber(ipKey)
    ])

    if (
      emailFailures >= VALIDATE_PASSWORD_RECOVERY_BLOCK_EMAIL_THRESHOLD ||
      ipFailures >= VALIDATE_PASSWORD_RECOVERY_BLOCK_IP_THRESHOLD
    ) {
      await this.blockAction(action, [emailKey, ipKey])
    }

    if (
      emailFailures >= VALIDATE_PASSWORD_RECOVERY_CAPTCHA_EMAIL_THRESHOLD ||
      ipFailures >= VALIDATE_PASSWORD_RECOVERY_CAPTCHA_IP_THRESHOLD
    ) {
      await this.requireCaptcha(action, ip, captchaToken)
    }
  }

  async trackInvalidPasswordRecoveryCode(ip: string, email: string) {
    const action = SECURITY_ACTION.validatePasswordRecoveryCode
    const [emailFailures, ipFailures] = await Promise.all([
      this.redisService.increment(this.buildKey(action, 'email', email), PASSWORD_RECOVERY_CODE_WINDOW_MS),
      this.redisService.increment(this.buildKey(action, 'ip', ip), PASSWORD_RECOVERY_CODE_WINDOW_MS)
    ])

    return {
      blocked:
        emailFailures >= VALIDATE_PASSWORD_RECOVERY_BLOCK_EMAIL_THRESHOLD ||
        ipFailures >= VALIDATE_PASSWORD_RECOVERY_BLOCK_IP_THRESHOLD
    }
  }

  async clearPasswordRecoveryCodeFailures(email: string) {
    await this.redisService.remove(this.buildKey(SECURITY_ACTION.validatePasswordRecoveryCode, 'email', email))
  }
}
