import { IConfirmEmailResponse, StatusEnum } from 'common-types'

import { verifyToken } from 'features/auth'
import { mapUserToDto, USER_MESSAGE } from 'features/user'

import { UserModel } from 'entities/user'

import { AppResponseType, ENV, IAppRequest } from 'shared-config'
import { throwHTTPError } from 'shared-lib'

import { MESSAGE } from './config'

export const confirmEmail = async (req: IAppRequest, res: AppResponseType<IConfirmEmailResponse>) => {
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
      return throwHTTPError(StatusEnum.BadRequest, res, USER_MESSAGE.userNotFound)
    }

    const response = {
      payload: { email: mapUserToDto(user).email },
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
