import { IGetUserDataResponse, StatusEnum } from 'common'

import { updateTokens } from 'src/features/auth'

import { UserModel } from 'src/entities/user'

import { type AppResponseType, type IAppRequest, SHARED_I18N } from 'src/shared/config'
import { getLocalizedText, throwHTTPError } from 'src/shared/lib'

import { mapUserToDto, USER_I18N } from './../shared'
import { GET_USER_DATA_I18N } from './config'

export const getUserDataController = async (req: IAppRequest, res: AppResponseType<IGetUserDataResponse>) => {
  const language = req.language

  try {
    const userId = req.app.locals.id

    const user = await UserModel.findById(userId)

    if (!user) {
      return throwHTTPError(StatusEnum.BadRequest, res, getLocalizedText(USER_I18N.userNotFound, language))
    }

    await updateTokens(userId, req, res)

    const response = {
      payload: mapUserToDto(user),
      message: { text: getLocalizedText(SHARED_I18N.success, language), silent: true }
    }

    return res.json(response)
  } catch {
    throwHTTPError(StatusEnum.Server, res, getLocalizedText(GET_USER_DATA_I18N.failedGetUserData, language))
  }
}
