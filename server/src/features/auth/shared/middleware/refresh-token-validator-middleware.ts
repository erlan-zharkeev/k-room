import { NextFunction, Response } from 'express'

import { StatusEnum } from 'common'

import { UserModel } from 'src/entities/user'

import { IAppRequest, SERVER_ENV } from 'src/shared/config'
import { localizedText, throwHTTPError } from 'src/shared/lib'

import { AUTH_I18N } from './../config'
import { updateTokens, verifyToken } from './../lib'

const haveNotRightsError = (req: IAppRequest, res: Response, silent = true) =>
  throwHTTPError(StatusEnum.NotAuth, res, localizedText(AUTH_I18N.nonAuthorized, req.language), silent)

export const refreshTokenValidatorMiddleware = async (req: IAppRequest, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies['refresh-jwt']

  if (!refreshToken) {
    return haveNotRightsError(req, res, false)
  }

  try {
    const decoded = await verifyToken(refreshToken, SERVER_ENV.refreshTokenSecret)
    const userId = decoded.id

    const userData = await UserModel.findById(userId)

    const deviceId = req.cookies['device-id']
    const device = deviceId ? userData?.system.device?.[deviceId] : undefined

    if (!device || device.refreshToken !== refreshToken) {
      return haveNotRightsError(req, res)
    }

    const isTokensEqual = device.refreshToken === refreshToken
    if (!isTokensEqual) return haveNotRightsError(req, res)

    await updateTokens(userId, req, res)
    req.app.locals = decoded
    return next()
  } catch {
    return haveNotRightsError(req, res)
  }
}
