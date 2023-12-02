import throwError from '../../utils/throwError'
import { NextFunction, Request, Response } from 'express'
import { jwt, updateTokens } from '../../services/jwt'
import ENV from '../../ENV'
import { UserModel } from '../../models/user.model'
import { AuthTokens, NotificationMessage, Status } from '../../../../types'
import { JWTDecoded } from '../../types/Common'

const haveNotRightsError = (res: Response) => throwError(Status.notAuth, res, NotificationMessage.nonAuthorized, true)

export const refreshTokenValidator = async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies[AuthTokens.refreshToken]
  if (!refreshToken) return throwError(Status.notAuth, res, NotificationMessage.nonAuthorized)
  jwt.verify(refreshToken, ENV?.K_ROOM_REFRESH_TOKEN_SECRET, async (error: string, decoded: JWTDecoded) => {
    if (error) return haveNotRightsError(res)
    const id = decoded.id
    const userData = await UserModel.findOne({ _id: id })
    const userRefreshToken = userData?.refreshToken
    if (!userRefreshToken) return haveNotRightsError(res)
    const isTokensEqual = userRefreshToken === refreshToken
    if (!isTokensEqual) return haveNotRightsError(res)
    await updateTokens(id, res)
    req.body.decoded = decoded
    next()
  })
}

export default refreshTokenValidator
