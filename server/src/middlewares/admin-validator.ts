import { NextFunction, Request, Response } from 'express'
import { ENV } from '../ENV'
import { jwt } from '../services'
import { Status, NotificationMessage, JWTDecoded, AuthTokens } from '../@types'
import { throwError } from '../utils'
import { UserModel } from '../models'

export const adminRoleValidator = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies[AuthTokens.accessToken]
  jwt.verify(accessToken, ENV?.K_ROOM_ACCESS_TOKEN_SECRET, async (error: string, decoded: JWTDecoded) => {
    if (error) return throwError(Status.notAuth, res, NotificationMessage.failedToDecodeAdminId)
    const id = decoded.id
    const userData = await UserModel.findOne({ _id: id })
    if (userData?.role !== 'admin') return throwError(Status.forbidden, res, NotificationMessage.forbiddenDoNotHavePermission)
    next()
  })
}
