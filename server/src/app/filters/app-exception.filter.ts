import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'
import { type Request, type Response } from 'express'
import { type IBackendResponse, REQ_STATUS } from 'shared'

import { SHARED_I18N } from 'src/shared/config/i18n'
import { isAppError } from 'src/shared/lib/app-error'
import { errorToMessage } from 'src/shared/lib/error-to-message'
import { localizedText } from 'src/shared/lib/localized-text'
import { log } from 'src/shared/lib/log'
import { serverCaptureSentryException, serverCaptureSentryHttpError } from 'src/shared/lib/sentry'

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  catch(error: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response<IBackendResponse<null>>>()
    const request = host.switchToHttp().getRequest<Request>()

    if (response.headersSent) {
      return
    }

    const { language } = request

    if (isAppError(error)) {
      const { message, silent, status } = error

      serverCaptureSentryHttpError({
        message,
        silent,
        status
      })

      response.status(status).json({
        payload: null,
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
