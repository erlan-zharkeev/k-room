import bcrypt from 'bcryptjs'

import { type ICreateNewPasswordPayload, StatusEnum } from 'common-types'

import { isCodeExpired } from 'features/code'

import { CodeModel } from 'entities/code'
import { UserModel } from 'entities/user'

import { AppResponseType, IAppRequest } from 'shared-config'
import { getLocalizedText, throwHTTPError } from 'shared-lib'

import { MESSAGE } from './config'

export const resetPassword = async (req: IAppRequest, res: AppResponseType<null>) => {
  const language = req.language

  try {
    const { codeToValidate, password }: ICreateNewPasswordPayload = req.body

    const userId = req.app.locals.id

    const code = await CodeModel.findById(userId)

    if (!code) {
      return throwHTTPError(StatusEnum.BadRequest, res, getLocalizedText(MESSAGE.failed, language))
    }

    // TODO Temp only via email
    const method = 'email'

    const { value: validCode, expiresAt } = code.codes.passwordRecovery[method]

    const isExpired = isCodeExpired(expiresAt)

    if (isExpired) {
      return throwHTTPError(StatusEnum.BadRequest, res, getLocalizedText(MESSAGE.codeExpired, language))
    }

    const isCodeMatched = codeToValidate === validCode

    if (!isCodeMatched) {
      return throwHTTPError(StatusEnum.BadRequest, res, getLocalizedText(MESSAGE.codeNotValid, language))
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

    return res.json({ payload: null, message: { text: getLocalizedText(MESSAGE.success, language), silent: true } })
  } catch {
    return throwHTTPError(StatusEnum.Server, res, getLocalizedText(MESSAGE.failed, language))
  }
}
