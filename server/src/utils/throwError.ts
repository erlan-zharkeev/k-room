import { Result, ValidationError } from 'express-validator'
import { Response } from 'express'
import { ErrorMessages } from './../types/Messages'
const clc = require('cli-color')

const throwError = (status: number, res: Response, errors: Result<ValidationError> | ErrorMessages) => {
  console.log(clc.red.bgWhite(`-${errors}`))
  return res.status(status).json({ message: errors, status, data: null })
}
export default throwError
