import { randomInt, randomUUID } from 'node:crypto'

import { Injectable } from '@nestjs/common'
import { type Request } from 'express'
import {
  EMAIL_CODE_LENGTH,
  type ICodeValidationPayload,
  formatNickname,
  isUnknownObject,
  type ISendChangeEmailCodePayload,
  type ISendPasswordRecoveryCodePayload,
  type IValidateChangeEmailCodePayload,
  type IValidateChangeEmailCodeResponse,
  type IValidatePasswordRecoveryCodeResponse,
  REQ_STATUS
} from 'global-shared'

import { SERVER_ENV } from 'src/app/env'
import { AppError } from 'src/shared/lib/app-error'
import { getRequestIp } from 'src/shared/lib/get-request-ip'
import { localizedText } from 'src/shared/lib/localized-text'

import { EmailService } from '../email/email.service'
import { SecurityService } from '../security/security.service'
import { UserService } from '../user/user.service'

import { CODE_LIFE_MS, QUERY_LIFE_MS, RESEND_CODE_INTERVAL_MS, isCodeExpired } from './codes.constants'
import { VALIDATE_CHANGE_EMAIL_CODE_I18N, VALIDATE_PASSWORD_RECOVERY_CODE_I18N } from './codes.i18n'
import { CodeModel } from './codes.model'
import type { ISendChangeEmailCodeResult, ISendPasswordRecoveryCodeResult } from './codes.types'

@Injectable()
export class CodesService {
  constructor(
    private readonly emailService: EmailService,
    private readonly userService: UserService,
    private readonly securityService: SecurityService
  ) {}

  async sendPasswordRecoveryCode(
    payload: ISendPasswordRecoveryCodePayload,
    request: Request
  ): Promise<ISendPasswordRecoveryCodeResult> {
    const { language } = request
    const ip = getRequestIp(request)
    const email = payload.email.trim()

    await this.securityService.assertSendPasswordRecoveryAllowed(payload.captchaToken, email, ip, language)
    await this.securityService.trackSendPasswordRecoveryAttempt(ip, email)

    const nowTimestampMs = Date.now()
    const user = await this.userService.findByEmail(email)

    if (!user) {
      return {
        nextTimeRequest: nowTimestampMs + RESEND_CODE_INTERVAL_MS,
        tooManyRequests: false
      }
    }

    const userId = String(user._id)
    const existingCode = await CodeModel.findById(userId)

    if (existingCode?.nextRequestPossibleAt && existingCode.nextRequestPossibleAt > nowTimestampMs) {
      return {
        nextTimeRequest: existingCode.nextRequestPossibleAt,
        tooManyRequests: true
      }
    }

    const code = String(randomInt(10 ** (EMAIL_CODE_LENGTH - 1), 10 ** EMAIL_CODE_LENGTH))
    const nextRequestTimestampMs = nowTimestampMs + RESEND_CODE_INTERVAL_MS

    await CodeModel.updateOne(
      { _id: userId },
      {
        $set: {
          'codes.passwordRecovery.email.value': code,
          'codes.passwordRecovery.email.expiresAt': nowTimestampMs + CODE_LIFE_MS,
          'codes.passwordRecovery.query.value': '',
          'codes.passwordRecovery.query.expiresAt': 0,
          nextRequestPossibleAt: nextRequestTimestampMs
        }
      },
      { upsert: true }
    )

    await this.emailService.sendPasswordRecoveryEmail({
      email,
      code,
      language,
      nickname: formatNickname(user.public.nickname)
    })

    return {
      nextTimeRequest: nextRequestTimestampMs,
      ...(SERVER_ENV.isDev ? { debugCode: code } : {}),
      tooManyRequests: false
    }
  }

  async sendChangeEmailCode(
    userId: string,
    payload: ISendChangeEmailCodePayload,
    request: Request
  ): Promise<ISendChangeEmailCodeResult> {
    const { language } = request
    const ip = getRequestIp(request)
    const email = payload.email.trim()

    await this.securityService.assertSendChangeEmailCodeAllowed(payload.captchaToken, email, ip, language)

    const nowTimestampMs = Date.now()
    const cooldownUntil = await this.securityService.getSendChangeEmailCodeCooldown(userId)

    if (cooldownUntil && cooldownUntil > nowTimestampMs) {
      return {
        nextTimeRequest: cooldownUntil,
        tooManyRequests: true
      }
    }

    const user = await this.userService.requireUser(userId, language)

    if (email.toLowerCase() === user.personal.email.toLowerCase()) {
      throw new AppError(
        REQ_STATUS.badRequest,
        localizedText(VALIDATE_CHANGE_EMAIL_CODE_I18N.emailNotChanged, language)
      )
    }

    const userWithSameEmail = await this.userService.findByEmail(email)

    if (userWithSameEmail && String(userWithSameEmail._id) !== userId) {
      throw new AppError(REQ_STATUS.badRequest, this.userService.getUserExistMessage('email', language))
    }

    const code = String(randomInt(10 ** (EMAIL_CODE_LENGTH - 1), 10 ** EMAIL_CODE_LENGTH))
    const nextRequestTimestampMs = nowTimestampMs + RESEND_CODE_INTERVAL_MS

    await this.securityService.trackSendChangeEmailCodeAttempt(ip, email, userId)
    await this.securityService.setChangeEmailCode(userId, JSON.stringify({ email, code }), CODE_LIFE_MS)
    await this.emailService.sendChangeEmailCodeEmail({
      email,
      code,
      language,
      nickname: formatNickname(user.public.nickname)
    })

    return {
      nextTimeRequest: nextRequestTimestampMs,
      ...(SERVER_ENV.isDev ? { debugCode: code } : {}),
      tooManyRequests: false
    }
  }

  async validateChangeEmailCode(
    userId: string,
    payload: IValidateChangeEmailCodePayload,
    request: Request
  ): Promise<IValidateChangeEmailCodeResponse> {
    const { language } = request
    const ip = getRequestIp(request)
    const email = payload.email.trim()
    const code = payload.code.trim()

    await this.securityService.assertValidateChangeEmailCodeAllowed(payload.captchaToken, email, ip, language)

    const stored = await this.securityService.getChangeEmailCode(userId)

    if (!stored) {
      await this.securityService.trackInvalidChangeEmailCode(ip, email)
      throw new AppError(REQ_STATUS.badRequest, localizedText(VALIDATE_CHANGE_EMAIL_CODE_I18N.expiredCode, language))
    }

    let parsed: unknown

    try {
      parsed = JSON.parse(stored)
    } catch {
      parsed = null
    }

    const storedEmail = isUnknownObject(parsed) ? parsed.email : null
    const storedCode = isUnknownObject(parsed) ? parsed.code : null
    const isValid =
      typeof storedEmail === 'string' &&
      typeof storedCode === 'string' &&
      storedEmail.toLowerCase() === email.toLowerCase() &&
      storedCode === code

    if (!isValid) {
      const { blocked } = await this.securityService.trackInvalidChangeEmailCode(ip, email)

      if (blocked) {
        await this.securityService.clearChangeEmailCode(userId)
      }

      throw new AppError(REQ_STATUS.badRequest, localizedText(VALIDATE_CHANGE_EMAIL_CODE_I18N.invalidCode, language))
    }

    await this.userService.changeEmail({ userId, email, language })
    await Promise.all([
      this.securityService.clearChangeEmailCode(userId),
      this.securityService.clearChangeEmailCodeFailures(email)
    ])

    return {
      email
    }
  }

  async validatePasswordRecoveryCode(
    payload: ICodeValidationPayload,
    request: Request
  ): Promise<IValidatePasswordRecoveryCodeResponse> {
    const { language } = request
    const ip = getRequestIp(request)
    const email = payload.email.trim()
    const code = payload.code.trim()

    await this.securityService.assertValidatePasswordRecoveryCodeAllowed(payload.captchaToken, email, ip, language)

    const user = await this.userService.findByEmail(email)

    if (!user) {
      await this.securityService.trackInvalidPasswordRecoveryCode(ip, email)
      throw new AppError(
        REQ_STATUS.badRequest,
        localizedText(VALIDATE_PASSWORD_RECOVERY_CODE_I18N.invalidCode, language)
      )
    }

    const codeDoc = await CodeModel.findById(String(user._id))

    if (!codeDoc) {
      await this.securityService.trackInvalidPasswordRecoveryCode(ip, email)
      throw new AppError(
        REQ_STATUS.badRequest,
        localizedText(VALIDATE_PASSWORD_RECOVERY_CODE_I18N.invalidCode, language)
      )
    }

    const currentCode = codeDoc.codes.passwordRecovery.email.value
    const currentCodeExpiresAtMs = codeDoc.codes.passwordRecovery.email.expiresAt

    if (isCodeExpired(currentCodeExpiresAtMs)) {
      throw new AppError(
        REQ_STATUS.badRequest,
        localizedText(VALIDATE_PASSWORD_RECOVERY_CODE_I18N.expiredCode, language)
      )
    }

    if (currentCode !== code) {
      const { blocked } = await this.securityService.trackInvalidPasswordRecoveryCode(ip, email)

      if (blocked) {
        await codeDoc.updateOne({
          $set: {
            'codes.passwordRecovery.query.value': '',
            'codes.passwordRecovery.query.expiresAt': 0,
            'codes.passwordRecovery.email.value': '',
            'codes.passwordRecovery.email.expiresAt': 0
          }
        })
      }

      throw new AppError(
        REQ_STATUS.badRequest,
        localizedText(VALIDATE_PASSWORD_RECOVERY_CODE_I18N.invalidCode, language)
      )
    }

    const query = randomUUID()

    await codeDoc.updateOne({
      $set: {
        'codes.passwordRecovery.query.value': query,
        'codes.passwordRecovery.query.expiresAt': Date.now() + QUERY_LIFE_MS
      }
    })
    await this.securityService.clearPasswordRecoveryCodeFailures(email)

    return {
      query
    }
  }
}
