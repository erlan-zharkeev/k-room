import { type NextFunction, type Response } from 'express'

import { StatusEnum } from 'common'

import { UserModel } from 'src/entities/user'

import { ENV, type IAppRequest } from 'src/shared/config'
import { getLocalizedText, throwHTTPError } from 'src/shared/lib'

import { AUTH_MESSAGE } from '../config'
import { updateTokens } from '../lib/update-token'
import { verifyToken } from '../lib/verify-token'

const haveNotRightsError = (req: IAppRequest, res: Response, silent = true) =>
  throwHTTPError(StatusEnum.NotAuth, res, getLocalizedText(AUTH_MESSAGE.nonAuthorized, req.language), silent)

export const refreshTokenValidator = async (req: IAppRequest, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies['refresh-jwt']

  if (!refreshToken) {
    return haveNotRightsError(req, res, false)
  }

  try {
    const decoded = await verifyToken(refreshToken, ENV.K_ROOM_REFRESH_TOKEN_SECRET)
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
