import { v4 as uuidv4 } from 'uuid'
import { Request, Response } from 'express'
import { ENV } from '../ENV'
import { UserModel } from '../models'
import { sendEmailCodePasswordRecovery } from '../services'
import { ServerNotificationMessage, StatusEnum } from '../@types'
import { notAccuratePinRandomGenerator, getNextTimeCodeRequest, throwError } from '../utils'

class CodesController {
  async emailPasswordRecovery(req: Request, res: Response) {
    try {
      const { email } = req.body

      const code = notAccuratePinRandomGenerator()
      const nextTimeRequest = getNextTimeCodeRequest(ENV.NEXT_CODE_REQUEST_INTERVAL_SECONDS)
      await UserModel.findOneAndUpdate(
        { email },
        { $set: { 'codes.passwordRecovery.email': code, 'codes.nextRequestPossibleAt': nextTimeRequest } },
        { new: true }
      )

      await sendEmailCodePasswordRecovery(email, code)

      return res.json({ message: ServerNotificationMessage.CheckEmailForCode, nextTimeRequest })
    } catch (e: unknown) {
      console.log(e)
      throwError(StatusEnum.BadRequest, res, ServerNotificationMessage.FailedCodeSend)
    }
  }

  async validateEmailCodePasswordRecovery(req: Request, res: Response) {
    try {
      const { email, code } = req.body
      const user = await UserModel.findOne({ email })
      const isCodeEqual = code === String(user?.codes.passwordRecovery.email)
      if (!isCodeEqual) throwError(StatusEnum.BadRequest, res, ServerNotificationMessage.InvalidConfirmCode)
      const passwordResetQuery = uuidv4()
      await user?.updateOne({
        $set: {
          'codes.passwordRecovery.query.value': passwordResetQuery,
          'codes.passwordRecovery.query.expiresIn': getNextTimeCodeRequest(ENV.PASSWORD_RECOVERY_LINK_LIFE)
        }
      })
      return res.json({
        message: ServerNotificationMessage.Success,
        query: passwordResetQuery,
        silent: true
      })
    } catch {
      throwError(StatusEnum.BadRequest, res, ServerNotificationMessage.CommonServerError)
    }
  }
}

export const controller = new CodesController()
