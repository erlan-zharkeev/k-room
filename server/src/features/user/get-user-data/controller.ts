import { StatusEnum } from 'common-types'
// import { UserModel } from 'entities/user'
import { type Request, type Response } from 'express'
// import { updateTokens } from 'features/auth'
import { ServerNotificationMessage } from 'shared-config'
import { throwHTTPError } from 'shared-lib'

export const getUserData = async (req: Request, res: Response) => {
  try {
    // const userId = req.app.locals.id
    // const user = await UserModel.findOne({ _id: userId })
    // if (!user) return throwHTTPError(StatusEnum.BadRequest, res, ServerNotificationMessage.UserNotFound)
    // await updateTokens(user._id.toString(), res)
    // const { username, email, avatarPath } = user.public
    // const { role, unreadInfoNotifications } = user.personal
    // return res.json({
    //   userData: {
    //     username,
    //     role,
    //     email,
    //     id: user._id,
    //     avatarPath,
    //     infoNotifications: unreadInfoNotifications
    //   }
    // })
  } catch {
    throwHTTPError(StatusEnum.BadRequest, res, ServerNotificationMessage.FailedGetUserData)
  }
}
