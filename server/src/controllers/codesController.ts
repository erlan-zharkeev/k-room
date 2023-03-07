import { UserModel } from '../models/user.model'
import { Request, Response } from 'express'
import throwError from '../utils/throwError'
import notAccuratePinRandomGenerator from '../utils/notAccuratePinRandomGenerator'
import { Messages } from '../types/Messages'
import { Status } from './../../../types'
import { sendEmailCodePasswordRecovery } from '../services/mail'
import { getNextTimeCodeRequest } from '../utils/getNextTimeCodeRequest'

class CodesController {
  async emailPasswordRecovery(req: Request, res: Response) {
    try {
      const { email } = req.body

      const code = notAccuratePinRandomGenerator()
      const nextTimeRequest = getNextTimeCodeRequest()
      await UserModel.findOneAndUpdate(
        { email },
        { $set: { 'codes.passwordRecovery.email': code, 'codes.nextRequestPossibleAt': nextTimeRequest } },
        { new: true }
      )

      await sendEmailCodePasswordRecovery(email, code)

      return res.json({ message: Messages.checkEmailForCode, nextTimeRequest })
    } catch (e) {
      console.log(e)
      throwError(Status.BAD_REQUEST, res, Messages.codeSendFailed)
    }
  }
}

export default new CodesController()
