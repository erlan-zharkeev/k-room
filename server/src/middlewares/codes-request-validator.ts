import { NextFunction, Request, Response } from 'express'
import { UserModel } from '../models'
import { ServerNotificationMessage, StatusEnum } from '../@types'
import { throwError } from '../utils'

export const codesRequestValidator = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body
    const candidate = await UserModel.findOne({ email })

    if (!candidate) throwError(StatusEnum.BadRequest, res, ServerNotificationMessage.CouldNotFindEmail)
    const currentDate = Date.now()

    const ableToSendCode = currentDate > Number(candidate?.codes.nextRequestPossibleAt)
    if (ableToSendCode) {
      next()
      return
    }
    throwError(StatusEnum.BadRequest, res, ServerNotificationMessage.NextTimeRequestNotPossible)
  } catch {
    throwError(StatusEnum.BadRequest, res, ServerNotificationMessage.CommonServerError)
  }
}
