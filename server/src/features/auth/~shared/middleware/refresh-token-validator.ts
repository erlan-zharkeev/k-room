import { StatusEnum } from 'common-types'
import { UserModel } from 'entities/user'
import { type NextFunction, type Request, type Response } from 'express'
import { MESSAGE, updateTokens, verifyToken } from 'features/auth'
import { ENV } from 'shared-config'
import { throwHTTPError } from 'shared-lib'

const haveNotRightsError = (res: Response, silent = true) =>
  throwHTTPError(StatusEnum.NotAuth, res, MESSAGE.nonAuthorized, silent)

export const refreshTokenValidator = async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies['refresh-jwt']

  if (!refreshToken) {
    return haveNotRightsError(res, false)
  }

  try {
    const decoded = await verifyToken(refreshToken, ENV.K_ROOM_REFRESH_TOKEN_SECRET)
    const userId = decoded.id

    const userData = await UserModel.findById(userId)

    const deviceId = req.cookies['device-id']
    const device = userData?.system.device?.[deviceId]

    if (!device || device.refreshToken !== refreshToken) {
      return haveNotRightsError(res)
    }

    const isTokensEqual = device.refreshToken === refreshToken
    if (!isTokensEqual) return haveNotRightsError(res)

    await updateTokens(userId, req, res)
    req.app.locals = decoded
    return next()
  } catch {
    return haveNotRightsError(res)
  }
}
