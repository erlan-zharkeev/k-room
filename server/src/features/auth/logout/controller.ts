import { ObjectId } from 'mongoose'
import { UserModel } from 'src/entities/user'
import { I18N_LOGOUT_MESSAGE } from 'src/features/auth'
import { AppResponseType, ENV, IAppRequest, SHARED_MESSAGE } from 'src/shared/config'
import { getIO, getLocalizedText, log, serverCaptureSentryException, throwHTTPError } from 'src/shared/lib'

import { StatusEnum } from 'common'

export const logout = async (req: IAppRequest, res: AppResponseType<null>) => {
  const language = req.language

  try {
    const deviceId = req.cookies['device-id']
    const userId = req.app.locals.id as ObjectId

    const user = await UserModel.findById(userId)
    if (user && deviceId) {
      const socketId = user.system.device[deviceId]?.socketId
      if (socketId) {
        getIO().sockets.sockets.get(socketId)?.disconnect(true)
      }
      if (user.system.device[deviceId]) {
        delete user.system.device[deviceId]
      }
      await user.save()
    }

    ;['jwt', 'refresh-jwt'].forEach((cookie) => {
      res.clearCookie(cookie, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        domain: ENV.IS_DEV ? undefined : ENV.COOKIE_DOMAIN || undefined,
        path: '/'
      })
    })
    return res.json({
      message: {
        text: getLocalizedText(SHARED_MESSAGE.success, language),
        silent: true
      },
      payload: null
    })
  } catch (error) {
    log.error(String(error))
    serverCaptureSentryException(error)
    throwHTTPError(StatusEnum.Server, res, getLocalizedText(I18N_LOGOUT_MESSAGE.failed, language))
  }
}
