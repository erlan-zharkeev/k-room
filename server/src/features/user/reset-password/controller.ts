import bcrypt from 'bcryptjs'
import { type ICreateNewPasswordPayload, StatusEnum } from 'common-types'
import { UserModel } from 'entities/user'
import { type Request, type Response } from 'express'
import { ServerNotificationMessage } from 'shared-config'
import { throwHTTPError } from 'shared-lib'

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { query, password } = req.body as ICreateNewPasswordPayload
    if (!password) return
    const hashedPassword = await bcrypt.hash(password, 6)
    if (!hashedPassword) return throwHTTPError(StatusEnum.BadRequest, res, ServerNotificationMessage.FailedPassHash)

    const user = await UserModel.findOne({ 'codes.passwordRecovery.query.value': query })
    if (!user) throwHTTPError(StatusEnum.BadRequest, res, ServerNotificationMessage.FailedResetPassword)

    await user?.updateOne({
      $set: {
        'codes.passwordRecovery.query.value': null,
        'codes.nextRequestPossibleAt': null,
        password: hashedPassword
      }
    })

    return res.json({ message: ServerNotificationMessage.PasswordReset, silent: true })
  } catch {
    return throwHTTPError(StatusEnum.BadRequest, res, ServerNotificationMessage.CommonServerError)
  }
}
