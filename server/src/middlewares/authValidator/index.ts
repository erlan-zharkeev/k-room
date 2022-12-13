import throwError from '../../utils/throwError'
import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { Status } from '../../../../types'

export const authValidator = (req: Request, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) throwError(Status.BAD_REQUEST, res, errors)
}

export default authValidator
