import { randomUUID } from 'node:crypto'

import { IValidatePasswordRecoveryCodeResponse, StatusEnum } from 'common'

import { isCodeExpired } from 'features/code'
import { MESSAGE, QUERY_LIFE_MS } from 'features/code/validate-password-recovery-code'
import { USER_MESSAGE } from 'features/user'

import { CodeModel } from 'entities/code'
import { UserModel } from 'entities/user'

import { AppResponseType, IAppRequest } from 'shared-config'
import { getLocalizedText, throwHTTPError } from 'shared-lib'

export const validatePasswordRecoveryCode = async (
  req: IAppRequest,
  res: AppResponseType<IValidatePasswordRecoveryCodeResponse>
) => {
  const language = req.language

  try {
    const { email, code } = req.body as { email: string, code: string }
    const user = await UserModel.findOne({ 'personal.email': email })

    if (!user) {
      return throwHTTPError(StatusEnum.BadRequest, res, getLocalizedText(USER_MESSAGE.userNotFound, language))
    }

    const codeDoc = await CodeModel.findById(user.id)

    if (!codeDoc) {
      return throwHTTPError(StatusEnum.BadRequest, res, getLocalizedText(MESSAGE.invalidCode, language))
    }

    const currentCode = codeDoc.codes.passwordRecovery.email.value
    const currentCodeExpiresAt = codeDoc.codes.passwordRecovery.email.expiresAt

    if (isCodeExpired(currentCodeExpiresAt)) {
      return throwHTTPError(StatusEnum.BadRequest, res, getLocalizedText(MESSAGE.expiredCode, language))
    }

    if (code !== currentCode) {
      return throwHTTPError(StatusEnum.BadRequest, res, getLocalizedText(MESSAGE.invalidCode, language))
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
        text: getLocalizedText(MESSAGE.validated, language),
        silent: true
      }
    })
  } catch {
    return throwHTTPError(StatusEnum.Server, res, getLocalizedText(MESSAGE.validationFailed, language))
  }
}
