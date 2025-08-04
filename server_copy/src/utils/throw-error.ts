import { Result, ValidationError } from 'express-validator'
import { Response } from 'express'
import type { ErrorResponse, ServerNotificationMessage } from 'shared/types'
import type { SocketActionsType } from 'common-types'
import { StatusEnum } from 'common-types'

import { clc } from './clc'
import { io } from '../app/server'

export const throwError = (
  status: StatusEnum,
  res: Response,
  errors: Result<ValidationError> | ServerNotificationMessage,
  silent: boolean = false
) => {
  console.log(clc.red.bgWhite(`-${errors}`))

  if (res.headersSent) {
    console.warn(clc.yellow(`⚠️ Attempted to send error after headers were already sent: ${errors}`))
    return
  }

  const payload: ErrorResponse<Result<ValidationError> | ServerNotificationMessage> = {
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
  io.to(socketId).emit<SocketActionsType>('error-message', { error, silent, status })
}
