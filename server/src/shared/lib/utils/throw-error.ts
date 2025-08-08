import type { SocketActionsType, StatusEnum } from 'common-types'
import { type Response } from 'express'
import type { ErrorResponse, ServerNotificationMessage } from 'shared-config'
import { getIO, log } from 'shared-lib'

export const throwHTTPError = (status: StatusEnum, res: Response, errors: any, silent: boolean = false) => {
  log.error(`-${errors}`)

  if (res.headersSent) {
    log.warn(`⚠️ Attempted to send error after headers were already sent: ${errors}`)
    return
  }

  const payload: any = {
    message: errors,
    status,
    data: null,
    silent
  }
  return res.status(status).json(payload)
}

export const throwSocketError = (
  socketId: string,
  error: ServerNotificationMessage,
  status: StatusEnum = 500,
  silent: boolean = false
) => {
  const io = getIO()
  io.to(socketId).emit<SocketActionsType>('error-message', { error, silent, status })
}
