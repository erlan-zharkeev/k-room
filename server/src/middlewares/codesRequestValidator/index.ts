import { NextFunction, Request, Response } from 'express'
import { UserModel } from './../../models/user.model'
import { ErrorMessages } from './../../types/Messages'
import throwError from './../../utils/throwError'
import { Status } from './../../../../types'

export const codesRequestValidator = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body
    const candidate = await UserModel.findOne({ email })

    if (!candidate) throwError(Status.badRequest, res, ErrorMessages.coudntFindEmail)
    const currentDate = Date.now()

    const ableToSendCode = currentDate > Number(candidate?.codes.nextRequestPossibleAt)
    if (ableToSendCode) {
      next()
      return
    }
    throwError(Status.badRequest, res, ErrorMessages.nextTimeRequestNotPossible)
  } catch {
    throwError(Status.badRequest, res, ErrorMessages.commonServerError)
  }
}

export default codesRequestValidator
