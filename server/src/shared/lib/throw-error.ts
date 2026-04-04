import { Response } from 'express'

import { IBackendResponse, LocalizedTextType, SocketActionsType, StatusEnum } from 'common'

import { SHARED_I18N, SocketInstanceType } from 'src/shared/config'
import {
  getIO,
  getLocalizedText,
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
  basicError?: string | LocalizedTextType<string> | null,
  options?: {
    status?: StatusEnum
    silent?: boolean
    cause?: unknown
  }
) => {
  const io = getIO()
  const socket = io.sockets.sockets.get(socketId) as SocketInstanceType | undefined
  const preparedMessage =
    typeof basicError === 'string'
      ? basicError.trim()
      : basicError
        ? getLocalizedText(basicError, socket?.data).trim()
        : ''
  const message = preparedMessage || getLocalizedText(SHARED_I18N.commonServerError, socket?.data)
  const status = options?.status ?? StatusEnum.Server
  const silent = options?.silent ?? false

  log.error(`-${message}`)

  if (options?.cause) {
    serverCaptureSentryException(options.cause)
  } else {
    serverCaptureSentrySocketError({ message, silent, status })
  }

  io.to(socketId).emit<SocketActionsType>('error-message', { message, silent, status })
}
