import { IConfirmEmailResponse, StatusEnum } from 'common'

import { mapUserToDto, USER_I18N } from 'src/features/user'

import { UserModel } from 'src/entities/user'

import { AppResponseType, ENV, IAppRequest } from 'src/shared/config'
import { getLocalizedText, throwHTTPError } from 'src/shared/lib'

import { verifyToken } from './../shared'
import { CONFIRM_EMAIL_I18N } from './config'

export const confirmEmailController = async (req: IAppRequest, res: AppResponseType<IConfirmEmailResponse>) => {
  const language = req.language

  try {
    const token = req.body.token
    const decoded = await verifyToken(token, ENV.EMAIL_CONFIRM_SECRET)
    const userId = decoded.id

    const updateResult = await UserModel.updateOne(
      { _id: userId, 'system.confirmed': { $ne: true } },
      { $set: { 'system.confirmed': true } }
    )

    const user = await UserModel.findById(userId)

    if (!user) {
      return throwHTTPError(StatusEnum.BadRequest, res, getLocalizedText(USER_I18N.userNotFound, language))
    }

    const response = {
      payload: { email: mapUserToDto(user).email },
      message: {
        text: getLocalizedText(
          updateResult.modifiedCount === 1
            ? CONFIRM_EMAIL_I18N.emailConfirmed
            : CONFIRM_EMAIL_I18N.emailAlreadyConfirmed,
          language
        ),
        silent: false
      }
    }

    return res.json(response)
  } catch {
    throwHTTPError(StatusEnum.Server, res, getLocalizedText(CONFIRM_EMAIL_I18N.failedEmailConfirm, language))
  }
}
