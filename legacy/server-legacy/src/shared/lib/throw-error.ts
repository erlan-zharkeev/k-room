import { DEFAULT_APP_LANGUAGE, BackendResponse, LocalizedText, SocketActions, REQ_STATUS, ReqStatus } from 'common'
import { Response } from 'express'

import { getIO } from 'src/shared/lib/io'
import { localizedText } from 'src/shared/lib/localized-text'
import { log } from 'src/shared/lib/log'
import {
  serverCaptureSentryException,
  serverCaptureSentryHttpError,
  serverCaptureSentrySocketError
} from 'src/shared/lib/sentry'

import { SHARED_I18N } from '../config/i18n'

export const throwHTTPError = (
  status: ReqStatus,
  res: Response | null,
  message: string,
  silent: boolean = false,
  error?: unknown
) => {
  log.error(`-${message}`)

  if (error) {
    serverCaptureSentryException(error)
  } else {
    serverCaptureSentryHttpError({ message, silent, status })
  }

  if (!res) return

  if (res.headersSent) {
    log.warn(`⚠️ Attempted to send error after headers were already sent: ${message}`)
    return
  }

  const payload: BackendResponse<null> = {
    payload: null,
    message: {
      text: message,
      silent
    }
  }

  return res.status(status).json(payload)
}

export const throwSocketError = (
  socketId: string,
  error?: LocalizedText<string> | string,
  options?: {
    status?: ReqStatus
    silent?: boolean
    cause?: unknown
  }
) => {
  const io = getIO()
  const socket = io.sockets.sockets.get(socketId)
  const nonLocalizedError = typeof error === 'string' || error === undefined
  const userMessageSource = nonLocalizedError ? SHARED_I18N.commonServerError : error
  const language = socket?.data.language ?? DEFAULT_APP_LANGUAGE
  const userMessage = localizedText(userMessageSource, language)
  const logErrorMessage = nonLocalizedError ? error : userMessage

  const status = options?.status ?? REQ_STATUS.server
  const silent = options?.silent ?? false

  log.error(`-${logErrorMessage}`)

  if (options?.cause) {
    serverCaptureSentryException(options.cause)
  } else {
    serverCaptureSentrySocketError({ message: logErrorMessage, silent, status })
  }

  io.to(socketId).emit<SocketActions>('error-message', { message: userMessage, silent, status })
}
