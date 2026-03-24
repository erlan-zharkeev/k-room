import { NextFunction, Request } from 'express'
import { validationResult } from 'express-validator'

import { StatusEnum } from 'common-types'

import { AppResponseType } from 'shared-config'

export const validateRequest = (req: Request, res: AppResponseType<null>, next: NextFunction) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(StatusEnum.BadRequest).json({
      payload: null,
      message: {
        text: errors.array().map((err) => err.msg)[0],
        silent: false
      }
    })
  }

  next()
}
