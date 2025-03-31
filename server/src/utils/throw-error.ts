import { Result, ValidationError } from 'express-validator'
import { Response } from 'express'
import { StatusEnum, ErrorResponse, ServerNotificationMessage } from '../@types'
import { clc } from './clc'

export const throwError = (
  status: StatusEnum,
  res: Response,
  errors: Result<ValidationError> | ServerNotificationMessage,
  silent: boolean = false
) => {
  console.log(clc.red.bgWhite(`-${errors}`))
  const payload: ErrorResponse<Result<ValidationError> | ServerNotificationMessage> = {
    message: errors,
    status,
    data: null,
    silent
  }
  return res.status(status).json(payload)
}
