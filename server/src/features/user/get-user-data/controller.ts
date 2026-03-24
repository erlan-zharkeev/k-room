import { IGetUserDataResponse, StatusEnum } from 'common-types'

import { updateTokens } from 'features/auth'
import { mapUserToDto, USER_MESSAGE } from 'features/user'
import { MESSAGE } from 'features/user/get-user-data/config'

import { UserModel } from 'entities/user'

import { type AppResponseType, type IAppRequest, SHARED_MESSAGE } from 'shared-config'
import { throwHTTPError } from 'shared-lib'

export const getUserData = async (req: IAppRequest, res: AppResponseType<IGetUserDataResponse>) => {
  try {
    const userId = req.app.locals.id

    const user = await UserModel.findById(userId)

    if (!user) {
      return throwHTTPError(StatusEnum.BadRequest, res, USER_MESSAGE.userNotFound)
    }

    await updateTokens(userId, req, res)

    const response = {
      payload: mapUserToDto(user),
      message: { text: SHARED_MESSAGE.success, silent: true }
    }

    return res.json(response)
  } catch {
    throwHTTPError(StatusEnum.Server, res, MESSAGE.failedGetUserData)
  }
}
