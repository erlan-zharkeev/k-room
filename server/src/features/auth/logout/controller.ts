import { REQ_STATUS } from 'common'

import { UserModel } from 'src/entities/user'

import { AppResponseType, IAppRequest, SERVER_ENV, SHARED_I18N } from 'src/shared/config'
import { getIO, localizedText, throwHTTPError } from 'src/shared/lib'

import { LOGOUT_I18N } from './config'

export const logoutController = async (req: IAppRequest, res: AppResponseType<null>) => {
  const { language } = req
  const basicError = localizedText(LOGOUT_I18N.failed, language)

  try {
    const deviceId = req.cookies['device-id']
    const userId = req.app.locals.id

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
        domain: SERVER_ENV.domain,
        path: '/'
      })
    })
    return res.json({
      message: {
        text: localizedText(SHARED_I18N.success, language),
        silent: true
      },
      payload: null
    })
  } catch (error) {
    throwHTTPError(REQ_STATUS.server, res, basicError, false, error)
  }
}
