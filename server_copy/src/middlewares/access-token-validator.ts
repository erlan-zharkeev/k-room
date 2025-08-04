import { NextFunction, Request, Response } from 'express'
import { ENV } from '../app/config/constants'
import { jwt } from '../services'
import { ServerNotificationMessage } from 'shared/types'
import type { JWTDecoded } from 'shared/types'
import { StatusEnum } from 'common-types'

import { throwError } from '../utils'
import { refreshTokenValidator } from './refresh-token-validator'

export const accessTokenValidator = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies['jwt']
  if (!accessToken) {
    return throwError(StatusEnum.NotAuth, res, ServerNotificationMessage.NonAuthorized, true)
  }
  jwt.verify(accessToken, ENV?.K_ROOM_ACCESS_TOKEN_SECRET, async (error: string, decoded: JWTDecoded) => {
    if (error) {
      return await refreshTokenValidator(req, res, next)
    }
    req.app.locals = decoded
    next()
  })
}
