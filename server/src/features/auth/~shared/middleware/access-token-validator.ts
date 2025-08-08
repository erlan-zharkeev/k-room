import { StatusEnum } from 'common-types'
import { type NextFunction, type Request, type Response } from 'express'
import { refreshTokenValidator, verifyToken } from 'features/auth'
import { ENV, ServerNotificationMessage } from 'shared-config'
import { throwHTTPError } from 'shared-lib'

export const accessTokenValidator = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.jwt

  if (!accessToken) {
    return throwHTTPError(StatusEnum.NotAuth, res, ServerNotificationMessage.NonAuthorized, true)
  }

  try {
    const decoded = await verifyToken(accessToken, ENV.K_ROOM_ACCESS_TOKEN_SECRET)
    req.app.locals = decoded
    return next()
  } catch {
    return await refreshTokenValidator(req, res, next)
  }
}
