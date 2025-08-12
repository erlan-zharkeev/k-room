import { IConfirmEmailResponse, StatusEnum } from 'common-types'
import { UserModel } from 'entities/user'
import { mapUserToDto, USER_MESSAGE } from 'features/user'
import { AppResponseType, IAppRequest } from 'shared-config'
import { throwHTTPError } from 'shared-lib'

import { MESSAGE } from './config'

export const confirmEmail = async (req: IAppRequest, res: AppResponseType<IConfirmEmailResponse>) => {
  try {
    const userId = req.body.userId

    const updateResult = await UserModel.updateOne(
      { _id: userId, 'system.confirmed': { $ne: true } },
      { $set: { 'system.confirmed': true } }
    )

    const user = await UserModel.findById(userId)

    if (!user) {
      return throwHTTPError(StatusEnum.BadRequest, res, USER_MESSAGE.userNotFound)
    }

    const response = {
      data: { email: mapUserToDto(user).email },
      message: {
        text: updateResult.modifiedCount === 1 ? MESSAGE.emailConfirmed : MESSAGE.emailAlreadyConfirmed,
        silent: false
      }
    }

    return res.json(response)
  } catch {
    throwHTTPError(StatusEnum.Server, res, MESSAGE.failedEmailConfirm)
  }
}
