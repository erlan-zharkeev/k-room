import { Body, Controller, Post, Req, Res } from '@nestjs/common'
import { type Request, type Response } from 'express'
import {
  CODES_ENDPOINTS,
  type IBackendResponse,
  type ICodeValidationPayload,
  type ISendPasswordRecoveryCodeResponse,
  type ISendPasswordRecoveryCodePayload,
  type IValidatePasswordRecoveryCodeResponse
} from 'global-shared'
import { isString } from 'lodash'

import { toAppError } from 'src/shared/lib/app-error'
import { localizedText } from 'src/shared/lib/localized-text'
import { runRequestValidation } from 'src/shared/lib/run-request-validation'

import { SEND_PASSWORD_RECOVERY_CODE_I18N, VALIDATE_PASSWORD_RECOVERY_CODE_I18N } from './codes.i18n'
import { CodesService } from './codes.service'
import { SEND_PASSWORD_RECOVERY_CODE_VALIDATION, VALIDATE_PASSWORD_RECOVERY_CODE_VALIDATION } from './codes.validation'

@Controller()
export class CodesController {
  constructor(private readonly codesService: CodesService) {}

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
