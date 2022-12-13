import throwError from '../../utils/throwError'
import { NextFunction, Request, Response } from 'express'
import { Messages } from '../../types/Messages'
import { jwt } from '../../services/jwt'
import ENV from '../../ENV'
import { Status } from '../../../../types'

export const accessTokenValidator = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.jwt
  if (!accessToken) return throwError(Status.NOT_AUTH, res, Messages.nonAuthorized)
  jwt.verify(accessToken, ENV?.JWT_ACCESS_TOKEN_SECRET, (error: any, decoded: any) => {
    if (error) return throwError(Status.TOKEN_EXPIRED, res, Messages.haventAccessRights)
    req.body.decoded = decoded
    next()
  })
}

export default accessTokenValidator
