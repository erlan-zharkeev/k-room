import { StatusEnum } from 'common-types'
import { UserModel } from 'entities/user'
import type { Request, Response } from 'express'
import { ServerNotificationMessage } from 'shared-config'
import { throwHTTPError } from 'shared-lib'

import { USER_MESSAGE } from '../~shared'
import { MESSAGE } from './config'
import { updateUserAvatar } from './lib'

export const updateUserData = async (req: Request, res: Response) => {
  try {
    const username: string | undefined = req.body.username
    const avatarFileBuffer: Buffer | undefined = req.file?.buffer
    const userId = req.app.locals.id

    if (!username && !avatarFileBuffer) {
      return throwHTTPError(StatusEnum.BadRequest, res, MESSAGE.nothingToUpdate)
    }

    const user = await UserModel.findById(userId)

    if (!user) {
      return throwHTTPError(StatusEnum.BadRequest, res, USER_MESSAGE.userNotFound)
    }

    if (username && username !== user.public.username) {
      await user.updateOne({ $set: { 'public.username': username } })
    }

    if (avatarFileBuffer) {
      await updateUserAvatar(avatarFileBuffer, userId, res)
    }

    // TODO Нужно сообщить всем у кого есть в контактах

    return res.json({ data: { username }, silent: true })
  } catch {
    throwHTTPError(StatusEnum.BadRequest, res, ServerNotificationMessage.FailedUserDataUpdate)
  }
}
