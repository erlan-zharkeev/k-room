import { NextFunction, Request, Response } from 'express'
import { ENV } from '../ENV'
import { jwt } from '../services'
import { Status, JWTDecoded } from '../@types'
import { throwError } from '../utils'
import { UserModel } from '../models'
import { ServerNotificationMessage } from '../@enums'

export const adminRoleValidator = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies['jwt']
  jwt.verify(accessToken, ENV?.K_ROOM_ACCESS_TOKEN_SECRET, async (error: string, decoded: JWTDecoded) => {
    if (error) return throwError(Status.NotAuth, res, ServerNotificationMessage.FailedToDecodeAdminId)
    const id = decoded.id
    const userData = await UserModel.findOne({ _id: id })
    if (userData?.role !== 'admin')
      return throwError(Status.Forbidden, res, ServerNotificationMessage.ForbiddenDoNotHavePermission)
    next()
  })
}
