import { StatusEnum } from "common-types"
import { UserModel } from "entities/user"
import { ObjectId } from "mongoose"
import { AppResponseType, IAppRequest, SHARED_MESSAGE } from "shared-config"
import { log, throwHTTPError } from "shared-lib"

import { MESSAGE } from "./config"

export const logout = async (req: IAppRequest, res: AppResponseType<null>) => {
  try {
    const deviceId = req.cookies['device-id']
    const userId = req.app.locals.id as ObjectId

    const user = await UserModel.findById(userId)
    if (user && deviceId) {
      if (user.system.device[deviceId]) {
        user.system.device[deviceId].refreshToken = ''
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
      data: null
    })
  } catch (e) {
    log.error(String(e))
    throwHTTPError(StatusEnum.Server, res, MESSAGE.failed)
  }
}
