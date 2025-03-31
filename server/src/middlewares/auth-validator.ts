import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { StatusEnum } from '../@types'
import { throwError } from '../utils'

export const authValidator = (req: Request, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) throwError(StatusEnum.BadRequest, res, errors)
}
