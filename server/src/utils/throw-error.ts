import { Result, ValidationError } from 'express-validator'
import { Response } from 'express'
import { NotificationMessage, Status, ErrorResponse } from '../@types'
import { clc } from '../server'

export const throwError = (
  status: Status,
  res: Response,
  errors: Result<ValidationError> | NotificationMessage,
  silent: boolean = false
) => {
  console.log(clc.red.bgWhite(`-${errors}`))
  const payload: ErrorResponse<Result<ValidationError> | NotificationMessage> = {
    message: errors,
    status,
    data: null,
    silent
  }
  return res.status(status).json(payload)
}
