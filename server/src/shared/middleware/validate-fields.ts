import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({
      title: 'Validation failed',
      errors: errors.array().map((err) => err.msg)
    })
  }

  next()
}
