import { ObjectId } from 'mongoose'

import { StatusEnum } from 'common'

import { UserModel } from 'entities/user'

import { AppResponseType, ENV, IAppRequest, SHARED_MESSAGE } from 'shared-config'
import { getLocalizedText, log, serverCaptureSentryException, throwHTTPError } from 'shared-lib'

import { MESSAGE } from './config'

export const logout = async (req: IAppRequest, res: AppResponseType<null>) => {
  const language = req.language

  try {
    const deviceId = req.cookies['device-id']
    const userId = req.app.locals.id as ObjectId

    const user = await UserModel.findById(userId)
    if (user && deviceId) {
      if (user.system.device[deviceId]) {
        delete user.system.device[deviceId]
      }
      await user.save()
    }

    ['jwt', 'refresh-jwt'].forEach((cookie) => {
      res.clearCookie(cookie, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        domain: ENV.IS_DEV ? undefined : ENV.COOKIE_DOMAIN || undefined,
        path: '/',
      })
    })
    return res.json({
      message: {
        text: getLocalizedText(SHARED_MESSAGE.success, language),
        silent: true,
      },
      payload: null
    })
  } catch (error) {
    log.error(String(error))
    serverCaptureSentryException(error)
    throwHTTPError(StatusEnum.Server, res, getLocalizedText(MESSAGE.failed, language))
  }
}
