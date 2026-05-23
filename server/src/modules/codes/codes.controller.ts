import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common'
import { type Request, type Response } from 'express'
import {
  CODES_ENDPOINTS,
  type BackendResponse,
  type CodeValidationPayload,
  type SendChangeEmailCodePayload,
  type SendChangeEmailCodeResponse,
  type SendPasswordRecoveryCodeResponse,
  type SendPasswordRecoveryCodePayload,
  isString,
  type ValidateChangeEmailCodePayload,
  type ValidateChangeEmailCodeResponse,
  type ValidatePasswordRecoveryCodeResponse
} from 'global-shared'

import { AppError, toAppError } from 'src/shared/lib/app-error'
import { localizedText } from 'src/shared/lib/localized-text'
import { runRequestValidation } from 'src/shared/lib/run-request-validation'

import { AccessTokenGuard } from '../session/session.guard'
import { SESSION_I18N } from '../session/session.i18n'

import {
  SEND_CHANGE_EMAIL_CODE_I18N,
  SEND_PASSWORD_RECOVERY_CODE_I18N,
  VALIDATE_CHANGE_EMAIL_CODE_I18N,
  VALIDATE_PASSWORD_RECOVERY_CODE_I18N
} from './codes.i18n'
import { CodesService } from './codes.service'
import {
  SEND_CHANGE_EMAIL_CODE_VALIDATION,
  SEND_PASSWORD_RECOVERY_CODE_VALIDATION,
  VALIDATE_CHANGE_EMAIL_CODE_VALIDATION,
  VALIDATE_PASSWORD_RECOVERY_CODE_VALIDATION
} from './codes.validation'

@Controller()
export class CodesController {
  constructor(private readonly codesService: CodesService) {}

  @Post(CODES_ENDPOINTS.sendEmailCodeChangeEmail)
  @UseGuards(AccessTokenGuard)
  async sendChangeEmailCode(
    @Req() request: Request,
    @Res() response: Response<BackendResponse<SendChangeEmailCodeResponse>>,
    @Body() payload: SendChangeEmailCodePayload
  ) {
    const { language, authUserId: userId } = request

    try {
      if (!userId) {
        throw new AppError(401, SESSION_I18N.nonAuthorized)
      }

      runRequestValidation(request, SEND_CHANGE_EMAIL_CODE_VALIDATION)
      const result = await this.codesService.sendChangeEmailCode(userId, payload, request)

      return response.json({
        payload: {
          nextTimeRequest: result.nextTimeRequest,
          ...(isString(result.debugCode) ? { debugCode: result.debugCode } : {})
        },
        message: {
          text: localizedText(
            result.tooManyRequests ? SEND_CHANGE_EMAIL_CODE_I18N.tooManyRequests : SEND_CHANGE_EMAIL_CODE_I18N.codeSent,
            language
          ),
          silent: false
        }
      })
    } catch (error) {
      throw toAppError(error, SEND_CHANGE_EMAIL_CODE_I18N.sendFailed)
    }
  }

  @Post(CODES_ENDPOINTS.validateEmailCodeChangeEmail)
  @UseGuards(AccessTokenGuard)
  async validateChangeEmailCode(
    @Req() request: Request,
    @Res() response: Response<BackendResponse<ValidateChangeEmailCodeResponse>>,
    @Body() payload: ValidateChangeEmailCodePayload
  ) {
    const { language, authUserId: userId } = request

    try {
      if (!userId) {
        throw new AppError(401, SESSION_I18N.nonAuthorized)
      }

      runRequestValidation(request, VALIDATE_CHANGE_EMAIL_CODE_VALIDATION)
      const result = await this.codesService.validateChangeEmailCode(userId, payload, request)

      return response.json({
        payload: result,
        message: {
          text: localizedText(VALIDATE_CHANGE_EMAIL_CODE_I18N.validated, language),
          silent: false
        }
      })
    } catch (error) {
      throw toAppError(error, VALIDATE_CHANGE_EMAIL_CODE_I18N.validationFailed)
    }
  }

  @Post(CODES_ENDPOINTS.sendEmailCodePasswordRecovery)
  async sendPasswordRecoveryCode(
    @Req() request: Request,
    @Res() response: Response<BackendResponse<SendPasswordRecoveryCodeResponse>>,
    @Body() payload: SendPasswordRecoveryCodePayload
  ) {
    const { language } = request

    try {
      runRequestValidation(request, SEND_PASSWORD_RECOVERY_CODE_VALIDATION)
      const result = await this.codesService.sendPasswordRecoveryCode(payload, request)

      return response.json({
        payload: {
          nextTimeRequest: result.nextTimeRequest,
          ...(isString(result.debugCode) ? { debugCode: result.debugCode } : {})
        },
        message: {
          text: localizedText(
            result.tooManyRequests
              ? SEND_PASSWORD_RECOVERY_CODE_I18N.tooManyRequests
              : SEND_PASSWORD_RECOVERY_CODE_I18N.codeSent,
            language
          ),
          silent: false
        }
      })
    } catch (error) {
      throw toAppError(error, SEND_PASSWORD_RECOVERY_CODE_I18N.sendFailed)
    }
  }

  @Post(CODES_ENDPOINTS.validateEmailCodePasswordRecovery)
  async validatePasswordRecoveryCode(
    @Req() request: Request,
    @Res() response: Response<BackendResponse<ValidatePasswordRecoveryCodeResponse>>,
    @Body() payload: CodeValidationPayload
  ) {
    const { language } = request

    try {
      runRequestValidation(request, VALIDATE_PASSWORD_RECOVERY_CODE_VALIDATION)
      const result = await this.codesService.validatePasswordRecoveryCode(payload, request)

      return response.json({
        payload: result,
        message: {
          text: localizedText(VALIDATE_PASSWORD_RECOVERY_CODE_I18N.validated, language),
          silent: true
        }
      })
    } catch (error) {
      throw toAppError(error, VALIDATE_PASSWORD_RECOVERY_CODE_I18N.validationFailed)
    }
  }
}
