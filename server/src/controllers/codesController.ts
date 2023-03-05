import { UserModel } from '../models/user.model'
import { Request, Response } from 'express'
import throwError from '../utils/throwError'
import notAccuratePinRandomGenerator from '../utils/notAccuratePinRandomGenerator'
import { Messages } from '../types/Messages'
import { Status } from './../../../types'
import { sendEmailCodePasswordRecovery } from '../services/mail'

class CodesController {
  async emailPasswordRecovery(req: Request, res: Response) {
    try {
      const { email } = req.body

      const code = notAccuratePinRandomGenerator()
      const candidate = await UserModel.findOneAndUpdate(
        { email },
        { $set: { 'codes.passwordRecovery.email': code } },
        { new: true }
      )
      if (!candidate) throwError(Status.BAD_REQUEST, res, Messages.coudntFindEmail)
      await sendEmailCodePasswordRecovery(email, code)

      return res.json({ message: Messages.checkEmailForCode })
    } catch (e) {
      console.log(e)
      // throwError(Status.BAD_REQUEST, res, Messages.updateSettings)
    }
  }
}

export default new CodesController()
