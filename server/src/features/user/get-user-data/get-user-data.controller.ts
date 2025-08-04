import { StatusEnum } from 'common-types'
import { UserModel } from 'entities/user'
import { ServerNotificationMessage } from 'shared/types'

export const getUserData = async (req: Request, res: Response) => {
  try {
    const userId = req.app.locals.id
    const user = await UserModel.findOne({ _id: userId })
    if (!user) return throwError(StatusEnum.BadRequest, res, ServerNotificationMessage.UserNotFound)
    await updateTokens(user._id.toString(), res)
    return res.json({
      userData: {
        username: user.username,
        role: user.role,
        email: user.email,
        id: user._id,
        avatarPath: user.avatarPath,
        infoNotifications: user.infoNotifications
      }
    })
  } catch {
    throwError(StatusEnum.BadRequest, res, ServerNotificationMessage.FailedGetUserData)
  }
}
