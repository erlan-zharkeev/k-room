import { IConfirmEmailResponse, StatusEnum } from 'common'

import { mapUserToDto, USER_I18N } from 'src/features/user'

import { UserModel } from 'src/entities/user'

import { AppResponseType, IAppRequest, SERVER_ENV } from 'src/shared/config'
import { localizedText, throwHTTPError } from 'src/shared/lib'

import { verifyToken } from './../shared'
import { CONFIRM_EMAIL_I18N } from './config'

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
      return throwHTTPError(StatusEnum.BadRequest, res, localizedText(USER_I18N.userNotFound, language))
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
    throwHTTPError(StatusEnum.Server, res, basicError, false, error)
  }
}
