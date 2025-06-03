import { Result, ValidationError } from 'express-validator'
import { Response } from 'express'
import { StatusEnum, ErrorResponse, ServerNotificationMessage, SocketActionsType } from '../@types'
import { clc } from './clc'
import { io } from '../server'

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
