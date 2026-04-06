import { randomUUID } from 'node:crypto'

import { IValidatePasswordRecoveryCodeResponse, REQ_STATUS } from 'common'

import { USER_I18N } from 'src/features/user'

import { CodeModel } from 'src/entities/code'
import { UserModel } from 'src/entities/user'

import { AppResponseType, IAppRequest } from 'src/shared/config'
import { localizedText, throwHTTPError } from 'src/shared/lib'

import { isCodeExpired } from './../shared'
import { QUERY_LIFE_MS, VALIDATE_PASSWORD_RECOVERY_CODE_I18N } from './config'

export const validatePasswordRecoveryCodeController = async (
  req: IAppRequest,
  res: AppResponseType<IValidatePasswordRecoveryCodeResponse>
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
