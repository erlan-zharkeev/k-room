import { StatusEnum } from 'common-types'
import type { Request, Response } from 'express'
import { ServerNotificationMessage } from 'shared-config'
import { throwHTTPError } from 'shared-lib'

export const signInWithProvider = async (req: Request, res: Response) => {
  try {
    // const { username, email, avatarPath, providerName }: UserCredentialType = req.body
    // let user = await UserModel.findOne({ email })
    // if (!user) {
    //   const hashedPassword = await bcrypt.hash(uuidv4(), 6)
    //   const welcomeInfoNotification = getPreviewInfoNotification('1')
    //   user = new UserModel({
    //     username,
    //     role: 'user',
    //     email,
    //     avatarPath,
    //     providerName,
    //     password: hashedPassword,
    //     socketId: '',
    //     confirmed: true,
    //     codes: initUserCodes,
    //     infoNotifications: [welcomeInfoNotification]
    //   })
    //   await user.save()
    // }

    // await updateTokens(user._id.toString(), res)

    return res.json({
      // userData: {
      //   username: user.username ?? username,
      //   email,
      //   id: user?._id,
      //   avatarPath: user.avatarPath ?? avatarPath,
      //   role: user.role,
      //   infoNotifications: user.infoNotifications
      // },
      // message: ServerNotificationMessage.LoginWithProvider,
      // silent: true
    })
  } catch {
    throwHTTPError(StatusEnum.BadRequest, res, ServerNotificationMessage.FailedLogin)
  }
}
