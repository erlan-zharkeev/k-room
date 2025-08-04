import { NextFunction, Request, Response } from 'express'
import { ServerNotificationMessage } from 'shared/types'
import { StatusEnum } from 'common-types'
import { throwError } from '../utils'
import { UserModel } from 'entities/user'

export const codesRequestValidator = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body
    const candidate = await UserModel.findOne({ email })

    if (!candidate) throwError(StatusEnum.BadRequest, res, ServerNotificationMessage.CouldNotFindEmail)
    const currentDate = Date.now()

    const ableToSendCode = currentDate > Number(candidate?.codes.nextRequestPossibleAt)

    console.log('ableToSendCode - ', ableToSendCode, currentDate, Number(candidate?.codes.nextRequestPossibleAt))

    if (ableToSendCode) {
      next()
      return
    }
    throwError(StatusEnum.BadRequest, res, ServerNotificationMessage.NextTimeRequestNotPossible)
  } catch {
    throwError(StatusEnum.BadRequest, res, ServerNotificationMessage.CommonServerError)
  }
}
