import bcrypt from 'bcryptjs'
import { type ICreateNewPasswordPayload, StatusEnum } from 'common-types'
import { CodeModel } from 'entities/code'
import { UserModel } from 'entities/user'
import { isCodeExpired } from 'features/code'
import { AppResponseType, IAppRequest } from 'shared-config'
import { throwHTTPError } from 'shared-lib'

import { MESSAGE } from './config'

export const resetPassword = async (req: IAppRequest, res: AppResponseType<null>) => {
  try {
    const { codeToValidate, password }: ICreateNewPasswordPayload = req.body

    const userId = req.app.locals.id

    const code = await CodeModel.findById(userId)

    if (!code) {
      return throwHTTPError(StatusEnum.BadRequest, res, MESSAGE.failed)
    }

    // TODO Temp only via email
    const method = 'email'

    const { value: validCode, expiresAt } = code.codes.passwordRecovery[method]

    const isExpired = isCodeExpired(expiresAt)

    if (isExpired) {
      return throwHTTPError(StatusEnum.BadRequest, res, MESSAGE.codeExpired)
    }

    const isCodeMatched = codeToValidate === validCode

    if (!isCodeMatched) {
      return throwHTTPError(StatusEnum.BadRequest, res, MESSAGE.codeNotValid)
    }

    const hashedPassword = await bcrypt.hash(password, 6)

    await UserModel.findOneAndUpdate({ _id: userId }, { 'system.password': hashedPassword })

    await code.updateOne({
      $set: {
        [`codes.passwordRecovery.${method}.value`]: '',
        [`codes.passwordRecovery.${method}.expiresAt`]: null,
        nextRequestPossibleAt: null
      }
    })

    return res.json({ data: null, message: { text: MESSAGE.success, silent: true } })
  } catch {
    return throwHTTPError(StatusEnum.Server, res, MESSAGE.failed)
  }
}
