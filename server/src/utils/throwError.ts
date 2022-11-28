import { Result, ValidationError } from 'express-validator'
import { Response } from 'express'
import { Messages } from '../types/Messages'
const clc = require('cli-color')

const throwError = (status: number, res: Response, errors: Result<ValidationError> | Messages) => {
  console.log(clc.red.bgWhite(`-${errors}`))
  return res.status(status).json({ message: errors, status, data: null })
}
export default throwError
