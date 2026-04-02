import type { IBackendResponse, SocketActionsType, StatusEnum } from 'common'
import { type Response } from 'express'

import { getIO, log, serverCaptureSentryException, serverCaptureSentryHttpError } from 'src/shared/lib'

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
  error: string = 'Unknown error',
  status: StatusEnum | undefined = 500,
  silent: boolean = false
) => {
  const io = getIO()
  io.to(socketId).emit<SocketActionsType>('error-message', { message: error, silent, status })
}
