import { randomInt, randomUUID } from 'node:crypto'

import { Injectable } from '@nestjs/common'
import { type Request } from 'express'
import {
  type ICodeValidationPayload,
  formatNickname,
  type ISendPasswordRecoveryCodePayload,
  type ISendPasswordRecoveryCodeResponse,
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
import { VALIDATE_PASSWORD_RECOVERY_CODE_I18N } from './codes.i18n'
import { CodeModel } from './codes.model'

const buildPasswordRecoveryCode = () => {
  return String(randomInt(100000, 1000000))
}

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
  ): Promise<ISendPasswordRecoveryCodeResponse & { tooManyRequests: boolean }> {
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

    const code = buildPasswordRecoveryCode()
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
