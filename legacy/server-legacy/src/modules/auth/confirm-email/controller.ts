import { IConfirmEmailResponse, REQ_STATUS } from 'common'

import { mapUserToDto, USER_I18N } from 'src/modules/user'
import { UserModel } from 'src/modules/user'

import { AppResponseType, IAppRequest, SERVER_ENV } from 'src/shared/config'
import { localizedText } from 'src/shared/lib/localized-text'
import { throwHTTPError } from 'src/shared/lib/throw-error'

import { verifyToken } from '../shared/lib/verify-token'

import { CONFIRM_EMAIL_I18N } from './i18n'

export const confirmEmailController = async (req: IAppRequest, res: AppResponseType<IConfirmEmailResponse>) => {
  const { language } = req
  const basicError = localizedText(CONFIRM_EMAIL_I18N.failedEmailConfirm, language)
  try {
    const token = req.body.token
    const decoded = await verifyToken(token, SERVER_ENV.emailConfirmSecret)
    const userId = decoded.id

    const updateResult = await UserModel.updateOne(
      { _id: userId, 'system.confirmed': { $ne: true } },
      { $set: { 'system.confirmed': true } }
    )

    const user = await UserModel.findById(userId)

    if (!user) {
      return throwHTTPError(REQ_STATUS.badRequest, res, localizedText(USER_I18N.userNotFound, language))
    }

    const response = {
      payload: { email: mapUserToDto(user).email },
      message: {
        text: localizedText(
          updateResult.modifiedCount === 1
            ? CONFIRM_EMAIL_I18N.emailConfirmed
            : CONFIRM_EMAIL_I18N.emailAlreadyConfirmed,
          language
        ),
        silent: false
      }
    }

    return res.json(response)
  } catch (error) {
    throwHTTPError(REQ_STATUS.server, res, basicError, false, error)
  }
}
