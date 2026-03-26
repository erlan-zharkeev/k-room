import bcrypt from 'bcryptjs'

import { type ICreateNewPasswordPayload, StatusEnum } from 'common'

import { isCodeExpired } from 'features/code'
import { MESSAGE } from 'features/user/reset-password/config'

import { CodeModel } from 'entities/code'
import { UserModel } from 'entities/user'

import { AppResponseType, IAppRequest } from 'shared-config'
import { getLocalizedText, throwHTTPError } from 'shared-lib'

export const resetPassword = async (req: IAppRequest, res: AppResponseType<null>) => {
  const language = req.language

  try {
    const { codeToValidate, password }: ICreateNewPasswordPayload = req.body
    const code = await CodeModel.findOne({ 'codes.passwordRecovery.query.value': codeToValidate })

    if (!code) {
      return throwHTTPError(StatusEnum.BadRequest, res, getLocalizedText(MESSAGE.failed, language))
    }

    const userId = code.id
    const { value: validCode, expiresAt } = code.codes.passwordRecovery.query

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
        'codes.passwordRecovery.query.value': '',
        'codes.passwordRecovery.query.expiresAt': 0,
        'codes.passwordRecovery.email.value': '',
        'codes.passwordRecovery.email.expiresAt': 0,
        nextRequestPossibleAt: null
      }
    })

    return res.json({ payload: null, message: { text: getLocalizedText(MESSAGE.success, language), silent: true } })
  } catch {
    return throwHTTPError(StatusEnum.Server, res, getLocalizedText(MESSAGE.failed, language))
  }
}
