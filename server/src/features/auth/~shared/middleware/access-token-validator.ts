import { type NextFunction, type Response } from 'express'

import { StatusEnum } from 'common'

import { AUTH_MESSAGE, refreshTokenValidator, verifyToken } from 'features/auth'

import { ENV, type IAppRequest } from 'shared-config'
import { getLocalizedText, throwHTTPError } from 'shared-lib'

export const accessTokenValidator = async (req: IAppRequest, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.jwt

  if (!accessToken) {
    return throwHTTPError(StatusEnum.NotAuth, res, getLocalizedText(AUTH_MESSAGE.nonAuthorized, req.language), true)
  }

  try {
    const decoded = await verifyToken(accessToken, ENV.K_ROOM_ACCESS_TOKEN_SECRET)
    req.app.locals = decoded
    return next()
  } catch {
    return refreshTokenValidator(req, res, next)
  }
}
