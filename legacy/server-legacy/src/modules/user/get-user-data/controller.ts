import { IGetUserDataResponse, REQ_STATUS } from 'common'

import { updateTokens } from 'src/modules/auth'

import { AppResponse, AppRequest, SHARED_I18N } from 'src/shared/config'
import { localizedText } from 'src/shared/lib/localized-text'
import { throwHTTPError } from 'src/shared/lib/throw-error'

import { USER_I18N } from '../shared/i18n'
import { mapUserToDto } from '../shared/lib/map-user-to-dto'
import { UserModel } from '../user.model'

import { GET_USER_DATA_I18N } from './i18n'

export const getUserDataController = async (req: AppRequest, res: AppResponse<IGetUserDataResponse>) => {
  const { language } = req
  const basicError = localizedText(GET_USER_DATA_I18N.failedGetUserData, language)

  try {
    const userId = req.app.locals.id

    const user = await UserModel.findById(userId)

    if (!user) {
      return throwHTTPError(REQ_STATUS.badRequest, res, localizedText(USER_I18N.userNotFound, language))
    }

    await updateTokens(userId, req, res)
    const response = {
      payload: mapUserToDto(user),
      message: { text: localizedText(SHARED_I18N.success, language), silent: true }
    }

    return res.json(response)
  } catch (error) {
    throwHTTPError(REQ_STATUS.server, res, basicError, false, error)
  }
}
