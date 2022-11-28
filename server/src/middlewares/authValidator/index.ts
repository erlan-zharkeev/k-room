import throwError from '../../utils/throwError'
import { Request, Response } from 'express'
import { validationResult } from 'express-validator'

export const authValidator = (req: Request, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) throwError(400, res, errors)
}

export default authValidator
