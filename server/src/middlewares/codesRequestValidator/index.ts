import { NextFunction, Request, Response } from 'express'
import { UserModel } from './../../models/user.model'
import { Messages } from './../../types/Messages'
import throwError from './../../utils/throwError'
import { Status } from './../../../../types'

export const codesRequestValidator = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body
    const candidate = await UserModel.findOne({ email })

    if (!candidate) throwError(Status.BAD_REQUEST, res, Messages.coudntFindEmail)
    const currentDate = Date.now()

    const ableToSendCode = currentDate > Number(candidate?.codes.nextRequestPossibleAt)
    if (ableToSendCode) {
      next()
      return
    }
    throwError(Status.BAD_REQUEST, res, Messages.nextTimeRequestNotPossible)
  } catch (e: any) {
    console.log(e)
    throwError(Status.BAD_REQUEST, res, Messages.commonServerError)
  }
}

export default codesRequestValidator
