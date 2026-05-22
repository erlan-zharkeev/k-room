import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'
import { type Request, type Response } from 'express'
import { type BackendResponse, REQ_STATUS } from 'global-shared'

import { SHARED_I18N } from 'src/shared/i18n'
import { getAppErrorMessage, isAppError } from 'src/shared/lib/app-error'
import { errorToMessage } from 'src/shared/lib/error-to-message'
import { localizedText } from 'src/shared/lib/localized-text'
import { log } from 'src/shared/lib/log'
import { serverCaptureSentryException, serverCaptureSentryHttpError } from 'src/shared/lib/sentry'

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  catch(error: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response<BackendResponse<unknown>>>()
    const request = host.switchToHttp().getRequest<Request>()

    if (response.headersSent) {
      return
    }

    const { language } = request

    if (isAppError(error)) {
      const { payload, silent, status } = error
      const message = getAppErrorMessage(error, language)

      serverCaptureSentryHttpError({
        message,
        silent,
        status
      })

      response.status(status).json({
        payload: payload ?? null,
        message: {
          text: message,
          silent
        }
      })

      return
    }

    log.error('-Unhandled http error')
    log.error(`-${errorToMessage(error)}`)

    serverCaptureSentryException(error)

    response.status(REQ_STATUS.server).json({
      payload: null,
      message: {
        text: localizedText(SHARED_I18N.commonServerError, language),
        silent: false
      }
    })
  }
}
