import { UserModel } from 'src/entities/user'
import { I18N_CONFIRM_EMAIL_MESSAGE, verifyToken } from 'src/features/auth'
import { mapUserToDto, USER_MESSAGE } from 'src/features/user'
import { AppResponseType, ENV, IAppRequest } from 'src/shared/config'
import { getLocalizedText, throwHTTPError } from 'src/shared/lib'

import { IConfirmEmailResponse, StatusEnum } from 'common'

export const confirmEmail = async (req: IAppRequest, res: AppResponseType<IConfirmEmailResponse>) => {
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
      return throwHTTPError(StatusEnum.BadRequest, res, getLocalizedText(USER_MESSAGE.userNotFound, language))
    }

    const response = {
      payload: { email: mapUserToDto(user).email },
      message: {
        text: getLocalizedText(
          updateResult.modifiedCount === 1
            ? I18N_CONFIRM_EMAIL_MESSAGE.emailConfirmed
            : I18N_CONFIRM_EMAIL_MESSAGE.emailAlreadyConfirmed,
          language
        ),
        silent: false
      }
    }

    return res.json(response)
  } catch {
    throwHTTPError(StatusEnum.Server, res, getLocalizedText(I18N_CONFIRM_EMAIL_MESSAGE.failedEmailConfirm, language))
  }
}
