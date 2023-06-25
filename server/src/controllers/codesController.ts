import { UserModel } from '../models/user.model'
import { Request, Response } from 'express'
import throwError from '../utils/throwError'
import notAccuratePinRandomGenerator from '../utils/notAccuratePinRandomGenerator'
import { ErrorMessages, SuccessMessages } from '../types/Messages'
import { Status } from './../../../types'
import { sendEmailCodePasswordRecovery } from '../services/mail'
import { getNextTimeCodeRequest } from '../utils/getNextTimeCodeRequest'
import { v4 as uuidv4 } from 'uuid'
import ENV from '../ENV'

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

      return res.json({ message: SuccessMessages.checkEmailForCode, nextTimeRequest })
    } catch {
      throwError(Status['bad-request'], res, ErrorMessages.failedCodeSend)
    }
  }
  async validateEmailCodePasswordRecovery(req: Request, res: Response) {
    try {
      const { email, code } = req.body
      const user = await UserModel.findOne({ email })
      const isCodeEqual = code === String(user?.codes.passwordRecovery.email)
      if (!isCodeEqual) throwError(Status['bad-request'], res, ErrorMessages.invalidConfirmCode)
      const passwordResetQuery = uuidv4()
      await user?.updateOne({
        $set: {
          'codes.passwordRecovery.query.value': passwordResetQuery,
          'codes.passwordRecovery.query.expiresIn': getNextTimeCodeRequest(ENV.PASSWORD_RECOVERY_LINK_LIFE)
        }
      })
      return res.json({ message: SuccessMessages.success, query: passwordResetQuery, silent: true })
    } catch {
      throwError(Status['bad-request'], res, ErrorMessages.commonServerError)
    }
  }
}

export default new CodesController()
