import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'
import { type Response } from 'express'
import { DEFAULT_APP_LANGUAGE, type AppLanguageType, type IBackendResponse, REQ_STATUS } from 'shared'

import { SHARED_I18N } from '../../shared/config/i18n'
import { isAppError } from '../../shared/lib/app-error'
import { localizedText } from '../../shared/lib/localized-text'

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  catch(error: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response<IBackendResponse<null>>>()
    const request = host.switchToHttp().getRequest<{ language?: AppLanguageType }>()

    if (response.headersSent) {
      return
    }

    const language = request.language ?? DEFAULT_APP_LANGUAGE

    if (isAppError(error)) {
      response.status(error.status).json({
        payload: null,
        message: {
          text: error.message,
          silent: error.silent
        }
      })

      return
    }

    if (error instanceof Error) {
      console.error(error)
    }

    if (error && !(error instanceof Error)) {
      console.error(error)
    }

    response.status(REQ_STATUS.server).json({
      payload: null,
      message: {
        text: localizedText(SHARED_I18N.commonServerError, language),
        silent: false
      }
    })
  }
}
