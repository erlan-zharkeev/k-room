import { type NextFunction, type Response } from 'express'

import { StatusEnum } from 'common'

import { type IAppRequest,SERVER_ENV } from 'src/shared/config'
import { getLocalizedText, throwHTTPError } from 'src/shared/lib'

import { AUTH_I18N } from './../config'
import { verifyToken } from './../lib'
import { refreshTokenValidator } from './index'

export const accessTokenValidator = async (req: IAppRequest, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.jwt

  if (!accessToken) {
    return throwHTTPError(StatusEnum.NotAuth, res, getLocalizedText(AUTH_I18N.nonAuthorized, req.language), true)
  }

  try {
    const decoded = await verifyToken(accessToken, SERVER_ENV.accessTokenSecret)
    req.app.locals = decoded
    return next()
  } catch {
    return refreshTokenValidator(req, res, next)
  }
}
