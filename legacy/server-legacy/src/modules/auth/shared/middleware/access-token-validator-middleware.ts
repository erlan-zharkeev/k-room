import { REQ_STATUS } from 'common'
import { NextFunction, Response } from 'express'

import { IAppRequest, SERVER_ENV } from 'src/shared/config'
import { localizedText } from 'src/shared/lib/localized-text'
import { throwHTTPError } from 'src/shared/lib/throw-error'

import { AUTH_I18N } from '../config/i18n'
import { verifyToken } from '../lib/verify-token'

import { refreshTokenValidatorMiddleware } from './refresh-token-validator-middleware'

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
