import { UserModel } from 'src/entities/user'
import { updateTokens } from 'src/features/auth'
import { mapUserToDto, USER_MESSAGE } from 'src/features/user'
import { I18N_GET_USER_DATA_MESSAGE } from 'src/features/user/get-user-data'
import { type AppResponseType, type IAppRequest, SHARED_MESSAGE } from 'src/shared/config'
import { getLocalizedText, throwHTTPError } from 'src/shared/lib'

import { IGetUserDataResponse, StatusEnum } from 'common'

export const getUserData = async (req: IAppRequest, res: AppResponseType<IGetUserDataResponse>) => {
  const language = req.language

  try {
    const userId = req.app.locals.id

    const user = await UserModel.findById(userId)

    if (!user) {
      return throwHTTPError(StatusEnum.BadRequest, res, getLocalizedText(USER_MESSAGE.userNotFound, language))
    }

    await updateTokens(userId, req, res)

    const response = {
      payload: mapUserToDto(user),
      message: { text: getLocalizedText(SHARED_MESSAGE.success, language), silent: true }
    }

    return res.json(response)
  } catch {
    throwHTTPError(StatusEnum.Server, res, getLocalizedText(I18N_GET_USER_DATA_MESSAGE.failedGetUserData, language))
  }
}
