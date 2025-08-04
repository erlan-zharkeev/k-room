import { NextFunction, Request, Response } from 'express'
import { ENV } from '../app/config/constants'
import { jwt } from '../services'
import { type JWTDecoded, ServerNotificationMessage } from 'shared/types'
import { StatusEnum } from 'common-types'

import { throwError } from '../utils'
import { UserModel } from 'entities/user'

export const adminRoleValidator = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies['jwt']
  jwt.verify(accessToken, ENV?.K_ROOM_ACCESS_TOKEN_SECRET, async (error: string, decoded: JWTDecoded) => {
    if (error) return throwError(StatusEnum.NotAuth, res, ServerNotificationMessage.FailedToDecodeAdminId)
    const id = decoded.id
    const userData = await UserModel.findOne({ _id: id })
    if (userData?.role !== 'admin')
      return throwError(StatusEnum.Forbidden, res, ServerNotificationMessage.ForbiddenDoNotHavePermission)
    next()
  })
}
