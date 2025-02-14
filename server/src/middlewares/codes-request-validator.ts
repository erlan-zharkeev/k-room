import { NextFunction, Request, Response } from 'express'
import { UserModel } from '../models'
import { Status } from '../@types'
import { throwError } from '../utils'
import { ServerNotificationMessage } from '../@enums'

export const codesRequestValidator = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body
    const candidate = await UserModel.findOne({ email })

    if (!candidate) throwError(Status.BadRequest, res, ServerNotificationMessage.CouldNotFindEmail)
    const currentDate = Date.now()

    const ableToSendCode = currentDate > Number(candidate?.codes.nextRequestPossibleAt)
    if (ableToSendCode) {
      next()
      return
    }
    throwError(Status.BadRequest, res, ServerNotificationMessage.NextTimeRequestNotPossible)
  } catch {
    throwError(Status.BadRequest, res, ServerNotificationMessage.CommonServerError)
  }
}
