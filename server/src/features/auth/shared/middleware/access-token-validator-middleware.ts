import { NextFunction, Response } from 'express'

import { REQ_STATUS } from 'common'

import { IAppRequest, SERVER_ENV } from 'src/shared/config'
import { localizedText, throwHTTPError } from 'src/shared/lib'

import { AUTH_I18N } from './../config'
import { verifyToken } from './../lib'

import { refreshTokenValidatorMiddleware } from './index'

export const accessTokenValidatorMiddleware = async (req: IAppRequest, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.jwt

  if (!accessToken) {
    return throwHTTPError(REQ_STATUS.notAuth, res, localizedText(AUTH_I18N.nonAuthorized, req.language), true)
  }

  try {
    const decoded = await verifyToken(accessToken, SERVER_ENV.accessTokenSecret)
    req.app.locals = decoded
    return next()
  } catch {
    return refreshTokenValidatorMiddleware(req, res, next)
  }
}
