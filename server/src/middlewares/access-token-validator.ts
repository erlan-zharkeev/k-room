import { NextFunction, Request, Response } from 'express'
import { ENV } from '../ENV'
import { jwt } from '../services'
import { Status, NotificationMessage, JWTDecoded } from '../@types'
import { throwError } from '../utils'
import { refreshTokenValidator } from './refresh-token-validator'

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
