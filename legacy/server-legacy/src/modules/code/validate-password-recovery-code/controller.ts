import { randomUUID } from 'node:crypto'

import { ValidatePasswordRecoveryCodeResponse, REQ_STATUS } from 'common'

import { USER_I18N } from 'src/modules/user'
import { UserModel } from 'src/modules/user'

import { AppResponse, AppRequest } from 'src/shared/config'
import { localizedText } from 'src/shared/lib/localized-text'
import { throwHTTPError } from 'src/shared/lib/throw-error'

import { CodeModel } from '../code.model'
import { isCodeExpired } from '../shared/lib/is-code-expired'

import { QUERY_LIFE_MS } from './config/constants'
import { VALIDATE_PASSWORD_RECOVERY_CODE_I18N } from './config/i18n'

export const validatePasswordRecoveryCodeController = async (
  req: AppRequest,
  res: AppResponse<ValidatePasswordRecoveryCodeResponse>
) => {
  const { language } = req
  const basicError = localizedText(VALIDATE_PASSWORD_RECOVERY_CODE_I18N.validationFailed, language)

  try {
    const { email, code } = req.body as { email: string; code: string }
    const user = await UserModel.findOne({ 'personal.email': email })

    if (!user) {
      return throwHTTPError(REQ_STATUS.badRequest, res, localizedText(USER_I18N.userNotFound, language))
    }

    const codeDoc = await CodeModel.findById(user.id)

    if (!codeDoc) {
      return throwHTTPError(
        REQ_STATUS.badRequest,
        res,
        localizedText(VALIDATE_PASSWORD_RECOVERY_CODE_I18N.invalidCode, language)
      )
    }

    const currentCode = codeDoc.codes.passwordRecovery.email.value
    const currentCodeExpiresAt = codeDoc.codes.passwordRecovery.email.expiresAt

    if (isCodeExpired(currentCodeExpiresAt)) {
      return throwHTTPError(
        REQ_STATUS.badRequest,
        res,
        localizedText(VALIDATE_PASSWORD_RECOVERY_CODE_I18N.expiredCode, language)
      )
    }

    if (code !== currentCode) {
      return throwHTTPError(
        REQ_STATUS.badRequest,
        res,
        localizedText(VALIDATE_PASSWORD_RECOVERY_CODE_I18N.invalidCode, language)
      )
    }

    const query = randomUUID()

    await codeDoc.updateOne({
      $set: {
        'codes.passwordRecovery.query.value': query,
        'codes.passwordRecovery.query.expiresAt': Date.now() + QUERY_LIFE_MS
      }
    })

    return res.json({
      payload: {
        query
      },
      message: {
        text: localizedText(VALIDATE_PASSWORD_RECOVERY_CODE_I18N.validated, language),
        silent: true
      }
    })
  } catch (error) {
    return throwHTTPError(REQ_STATUS.server, res, basicError, false, error)
  }
}
