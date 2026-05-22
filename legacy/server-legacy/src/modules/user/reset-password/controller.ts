import bcrypt from 'bcryptjs'
import { CreateNewPasswordPayload, REQ_STATUS } from 'common'

import { isCodeExpired } from 'src/modules/code'
import { CodeModel } from 'src/modules/code'

import { AppResponse, AppRequest } from 'src/shared/config'
import { localizedText } from 'src/shared/lib/localized-text'
import { throwHTTPError } from 'src/shared/lib/throw-error'

import { UserModel } from '../user.model'

import { RESET_PASSWORD_I18N } from './i18n'

export const resetPasswordController = async (req: AppRequest, res: AppResponse<null>) => {
  const { language } = req
  const basicError = localizedText(RESET_PASSWORD_I18N.failed, language)

  try {
    const { codeToValidate, password }: CreateNewPasswordPayload = req.body
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
