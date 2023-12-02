import throwError from '../../utils/throwError'
import { NextFunction, Request, Response } from 'express'
import { jwt } from '../../services/jwt'
import ENV from '../../ENV'
import { NotificationMessage, Status } from '../../../../types'
import refreshTokenValidator from '../refreshTokenValidator'
import { JWTDecoded } from '../../types/Common'

export const accessTokenValidator = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.jwt
  if (!accessToken) return throwError(Status.notAuth, res, NotificationMessage.nonAuthorized)
  jwt.verify(accessToken, ENV?.K_ROOM_ACCESS_TOKEN_SECRET, (error: string, decoded: JWTDecoded) => {
    if (error) return refreshTokenValidator(req, res, next)
    req.body.decoded = decoded
    next()
  })
}

export const socketAuthTokenValidator = () => {}

export default accessTokenValidator
