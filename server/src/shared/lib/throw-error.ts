import { Response } from 'express'

import { DEFAULT_APP_LANGUAGE, IBackendResponse, LocalizedTextType, SocketActionsType, StatusEnum } from 'common'

import { SHARED_I18N } from 'src/shared/config'
import {
  getIO,
  localizedText,
  log,
  serverCaptureSentryException,
  serverCaptureSentryHttpError,
  serverCaptureSentrySocketError
} from 'src/shared/lib'

export const throwHTTPError = (
  status: StatusEnum,
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

  const payload: IBackendResponse<null> = {
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
  error?: LocalizedTextType<string> | string,
  options?: {
    status?: StatusEnum
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

  const status = options?.status ?? StatusEnum.Server
  const silent = options?.silent ?? false

  log.error(`-${logErrorMessage}`)

  if (options?.cause) {
    serverCaptureSentryException(options.cause)
  } else {
    serverCaptureSentrySocketError({ message: logErrorMessage, silent, status })
  }

  io.to(socketId).emit<SocketActionsType>('error-message', { message: userMessage, silent, status })
}
