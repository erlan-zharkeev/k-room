import { randomUUID } from 'node:crypto'

import { IValidatePasswordRecoveryCodeResponse, StatusEnum } from 'common'

import { QUERY_LIFE_MS, VALIDATE_PASSWORD_RECOVERY_CODE_I18N } from './config'
import { isCodeExpired } from './../shared'
import { USER_I18N } from 'src/features/user'

import { CodeModel } from 'src/entities/code'
import { UserModel } from 'src/entities/user'

import { AppResponseType, IAppRequest } from 'src/shared/config'
import { getLocalizedText, throwHTTPError } from 'src/shared/lib'

export const validatePasswordRecoveryCodeController = async (
  req: IAppRequest,
  res: AppResponseType<IValidatePasswordRecoveryCodeResponse>
) => {
  const language = req.language

  try {
    const { email, code } = req.body as { email: string; code: string }
    const user = await UserModel.findOne({ 'personal.email': email })

    if (!user) {
      return throwHTTPError(StatusEnum.BadRequest, res, getLocalizedText(USER_I18N.userNotFound, language))
    }

    const codeDoc = await CodeModel.findById(user.id)

    if (!codeDoc) {
      return throwHTTPError(
        StatusEnum.BadRequest,
        res,
        getLocalizedText(VALIDATE_PASSWORD_RECOVERY_CODE_I18N.invalidCode, language)
      )
    }

    const currentCode = codeDoc.codes.passwordRecovery.email.value
    const currentCodeExpiresAt = codeDoc.codes.passwordRecovery.email.expiresAt

    if (isCodeExpired(currentCodeExpiresAt)) {
      return throwHTTPError(
        StatusEnum.BadRequest,
        res,
        getLocalizedText(VALIDATE_PASSWORD_RECOVERY_CODE_I18N.expiredCode, language)
      )
    }

    if (code !== currentCode) {
      return throwHTTPError(
        StatusEnum.BadRequest,
        res,
        getLocalizedText(VALIDATE_PASSWORD_RECOVERY_CODE_I18N.invalidCode, language)
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
        text: getLocalizedText(VALIDATE_PASSWORD_RECOVERY_CODE_I18N.validated, language),
        silent: true
      }
    })
  } catch {
    return throwHTTPError(
      StatusEnum.Server,
      res,
      getLocalizedText(VALIDATE_PASSWORD_RECOVERY_CODE_I18N.validationFailed, language)
    )
  }
}
