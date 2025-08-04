import { NextFunction, Request, Response } from 'express'
import { ENV } from '../app/config/constants'
import { jwt, updateTokens } from '../services'
import { type JWTDecoded, ServerNotificationMessage } from 'shared/types'
import { StatusEnum } from 'common-types'

import { throwError } from '../utils'
import { UserModel } from 'entities/user'

const haveNotRightsError = (res: Response) =>
  throwError(StatusEnum.NotAuth, res, ServerNotificationMessage.NonAuthorized, true)

export const refreshTokenValidator = async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies['refresh-jwt']
  if (!refreshToken) {
    return throwError(StatusEnum.NotAuth, res, ServerNotificationMessage.NonAuthorized)
  }
  jwt.verify(refreshToken, ENV?.K_ROOM_REFRESH_TOKEN_SECRET, async (error: string, decoded: JWTDecoded) => {
    if (error) {
      return haveNotRightsError(res)
    }
    const id = decoded.id
    const userData = await UserModel.findOne({ _id: id })
    const userRefreshToken = userData?.refreshToken
    if (!userRefreshToken) return haveNotRightsError(res)
    const isTokensEqual = userRefreshToken === refreshToken
    if (!isTokensEqual) return haveNotRightsError(res)
    await updateTokens(id, res)
    req.app.locals = decoded
    next()
  })
}
