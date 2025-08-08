import { StatusEnum } from 'common-types'
import { UserModel } from 'entities/user'
import type { Request, Response } from 'express'
import { ServerNotificationMessage } from 'shared-config'
import { throwHTTPError } from 'shared-lib'

export const confirmEmail = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId
    const user = await UserModel.findOneAndUpdate({ _id: userId }, { confirmed: true }, { new: true })
    if (!user) return
    return res.json({
      // userData: { username: user.username, email: user.email, id: user._id, avatar: user.avatarPath },
      // message: ServerNotificationMessage.EmailConfirmed
    })
  } catch {
    throwHTTPError(StatusEnum.BadRequest, res, ServerNotificationMessage.FailedEmailConfirm)
  }
}
