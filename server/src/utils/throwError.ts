import { Result, ValidationError } from 'express-validator'
import { Response } from 'express'
import { NotificationMessage } from '../../../types'
const clc = require('cli-color')

const throwError = (status: number, res: Response, errors: Result<ValidationError> | NotificationMessage) => {
  console.log(clc.red.bgWhite(`-${errors}`))
  return res.status(status).json({ message: errors, status, data: null })
}
export default throwError
