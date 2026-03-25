import { ObjectId } from "mongoose"

import { StatusEnum } from "common-types"

import { UserModel } from "entities/user"

import { AppResponseType, IAppRequest, SHARED_MESSAGE } from "shared-config"
import { log, serverCaptureSentryException, throwHTTPError } from "shared-lib"

import { MESSAGE } from "./config"

export const logout = async (req: IAppRequest, res: AppResponseType<null>) => {
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
        sameSite: "lax",
        path: "/",
      })
    })
    return res.json({
      message: {
        text: SHARED_MESSAGE.success,
        silent: true,
      },
      payload: null
    })
  } catch (error) {
    log.error(String(error))
    serverCaptureSentryException(error)
    throwHTTPError(StatusEnum.Server, res, MESSAGE.failed)
  }
}
