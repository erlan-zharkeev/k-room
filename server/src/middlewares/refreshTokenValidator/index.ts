import throwError from '../../utils/throwError'
import { NextFunction, Request, Response } from 'express'
import { jwt } from '../../services/jwt'
import ENV from '../../ENV'
import { UserModel } from '../../models/user.model'
import { NotificationMessage, Status } from '../../../../types'

const haventRightsError = (res: Response) => throwError(Status.notAuth, res, NotificationMessage.nonAuthorized)

export const refreshTokenValidator = async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies['refresh-jwt']
  if (!refreshToken) return throwError(Status.notAuth, res, NotificationMessage.nonAuthorized)
  jwt.verify(refreshToken, ENV?.K_ROOM_REFRESH_TOKEN_SECRET, async (error: any, decoded: any) => {
    if (error) return haventRightsError(res)
    const id = decoded.id
    const userData = await UserModel.findOne({ _id: id })
    const userRefreshToken = userData?.refreshToken
    if (!userRefreshToken) return haventRightsError(res)
    const isTokensEqual = userRefreshToken === refreshToken
    if (!isTokensEqual) return haventRightsError(res)
    req.body.decoded = decoded
    next()
  })
}

export default refreshTokenValidator
