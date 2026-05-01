import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common'
import { type Request, type Response } from 'express'
import {
  CODES_ENDPOINTS,
  type IBackendResponse,
  type ICodeValidationPayload,
  type ISendChangeEmailCodePayload,
  type ISendChangeEmailCodeResponse,
  type ISendPasswordRecoveryCodeResponse,
  type ISendPasswordRecoveryCodePayload,
  type IValidateChangeEmailCodePayload,
  type IValidateChangeEmailCodeResponse,
  type IValidatePasswordRecoveryCodeResponse
} from 'global-shared'
import { isString } from 'lodash'

import { AppError, toAppError } from 'src/shared/lib/app-error'
import { localizedText } from 'src/shared/lib/localized-text'
import { runRequestValidation } from 'src/shared/lib/run-request-validation'

import { AccessTokenGuard } from '../auth/auth.guard'
import { AUTH_I18N } from '../auth/auth.i18n'

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
    @Res() response: Response<IBackendResponse<ISendChangeEmailCodeResponse>>,
    @Body() payload: ISendChangeEmailCodePayload
  ) {
    const { language, authUserId: userId } = request

    try {
      if (!userId) {
        throw new AppError(401, localizedText(AUTH_I18N.nonAuthorized, language))
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
      throw toAppError(error, localizedText(SEND_CHANGE_EMAIL_CODE_I18N.sendFailed, language))
    }
  }

  @Post(CODES_ENDPOINTS.validateEmailCodeChangeEmail)
  @UseGuards(AccessTokenGuard)
  async validateChangeEmailCode(
    @Req() request: Request,
    @Res() response: Response<IBackendResponse<IValidateChangeEmailCodeResponse>>,
    @Body() payload: IValidateChangeEmailCodePayload
  ) {
    const { language, authUserId: userId } = request

    try {
      if (!userId) {
        throw new AppError(401, localizedText(AUTH_I18N.nonAuthorized, language))
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
      throw toAppError(error, localizedText(VALIDATE_CHANGE_EMAIL_CODE_I18N.validationFailed, language))
    }
  }

  @Post(CODES_ENDPOINTS.sendEmailCodePasswordRecovery)
  async sendPasswordRecoveryCode(
    @Req() request: Request,
    @Res() response: Response<IBackendResponse<ISendPasswordRecoveryCodeResponse>>,
    @Body() payload: ISendPasswordRecoveryCodePayload
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
      throw toAppError(error, localizedText(SEND_PASSWORD_RECOVERY_CODE_I18N.sendFailed, language))
    }
  }

  @Post(CODES_ENDPOINTS.validateEmailCodePasswordRecovery)
  async validatePasswordRecoveryCode(
    @Req() request: Request,
    @Res() response: Response<IBackendResponse<IValidatePasswordRecoveryCodeResponse>>,
    @Body() payload: ICodeValidationPayload
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
      throw toAppError(error, localizedText(VALIDATE_PASSWORD_RECOVERY_CODE_I18N.validationFailed, language))
    }
  }
}
