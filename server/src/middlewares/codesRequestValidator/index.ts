import { NextFunction, Request, Response } from 'express'
import { UserModel } from './../../models/user.model'
import throwError from './../../utils/throwError'
import { NotificationMessage, Status } from './../../../../types'

export const codesRequestValidator = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body
    const candidate = await UserModel.findOne({ email })

    if (!candidate) throwError(Status.badRequest, res, NotificationMessage.coudntFindEmail)
    const currentDate = Date.now()

    const ableToSendCode = currentDate > Number(candidate?.codes.nextRequestPossibleAt)
    if (ableToSendCode) {
      next()
      return
    }
    throwError(Status.badRequest, res, NotificationMessage.nextTimeRequestNotPossible)
  } catch {
    throwError(Status.badRequest, res, NotificationMessage.commonServerError)
  }
}

export default codesRequestValidator
