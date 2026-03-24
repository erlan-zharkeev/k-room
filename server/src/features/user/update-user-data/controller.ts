import { SocketActionsType, StatusEnum } from 'common-types'

import { getSocketsByUserIds, transformUserToContact, USER_MESSAGE } from 'features/user'
import { MESSAGE } from 'features/user/update-user-data/config'

import { UserModel } from 'entities/user'

import { AppResponseType, IAppRequest, ServerNotificationMessage, SHARED_MESSAGE } from 'shared-config'
import { getIO, log, throwHTTPError } from 'shared-lib'

import { updateUserAvatar } from './lib'

export const updateUserData = async (req: IAppRequest, res: AppResponseType<null>) => {
  try {
    const username: string | undefined = req.body.username
    const avatarFileBuffer: Buffer | undefined = req.file?.buffer
    const resetAvatar: 'reset' | '' = req.body['reset-avatar']
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

    if (resetAvatar === 'reset') {
      await updateUserAvatar(null, userId, res)
    }

    const contacts = await UserModel.find(
      { [`personal.contacts.${userId}`]: { $exists: true } },
      { _id: 1 }
    ).lean()

    const ids = contacts.map((c) => String(c._id))
    if (ids.length) {
      const socketIds = await getSocketsByUserIds(ids)
      const updatedUserData = await UserModel.findById(userId).lean()
      if (!updatedUserData) return
      socketIds.forEach((socketId) => {
        log.warn(String(socketId))
        getIO().to(socketId).emit<SocketActionsType>('contact-data-changed', transformUserToContact(updatedUserData)
        )
      })
    }


    return res.json({ payload: null, message: { text: SHARED_MESSAGE.success, silent: true } })
  } catch (e: unknown) {
    log.error(String(e))
    throwHTTPError(StatusEnum.Server, res, ServerNotificationMessage.FailedUserDataUpdate)
  }
}
