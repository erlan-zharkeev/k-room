import bcrypt from 'bcryptjs'

import { ICreateNewPasswordPayload, REQ_STATUS } from 'common'

import { isCodeExpired } from 'src/features/code'

import { CodeModel } from 'src/entities/code'
import { UserModel } from 'src/entities/user'

import { AppResponseType, IAppRequest } from 'src/shared/config'
import { localizedText, throwHTTPError } from 'src/shared/lib'

import { RESET_PASSWORD_I18N } from './config'

export const resetPasswordController = async (req: IAppRequest, res: AppResponseType<null>) => {
  const { language } = req
  const basicError = localizedText(RESET_PASSWORD_I18N.failed, language)

  try {
    const { codeToValidate, password }: ICreateNewPasswordPayload = req.body
    const code = await CodeModel.findOne({ 'codes.passwordRecovery.query.value': codeToValidate })

    if (!code) {
      return throwHTTPError(REQ_STATUS.badRequest, res, basicError)
    }

    const userId = code.id
    const { value: validCode, expiresAt } = code.codes.passwordRecovery.query

    const isExpired = isCodeExpired(expiresAt)

    if (isExpired) {
      return throwHTTPError(REQ_STATUS.badRequest, res, localizedText(RESET_PASSWORD_I18N.codeExpired, language))
    }

    const isCodeMatched = codeToValidate === validCode

    if (!isCodeMatched) {
      return throwHTTPError(REQ_STATUS.badRequest, res, localizedText(RESET_PASSWORD_I18N.codeNotValid, language))
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

    return res.json({
      payload: null,
      message: { text: localizedText(RESET_PASSWORD_I18N.success, language), silent: true }
    })
  } catch (error) {
    return throwHTTPError(REQ_STATUS.server, res, basicError, false, error)
  }
}
