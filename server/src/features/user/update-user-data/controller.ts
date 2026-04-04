import { SocketActionsType, StatusEnum } from 'common'

import { UserModel } from 'src/entities/user'

import { AppResponseType, IAppRequest, SHARED_I18N } from 'src/shared/config'
import { getIO, isAppError, localizedText, log, throwHTTPError } from 'src/shared/lib'

import { getSocketsByUserIds, transformUserToContact, USER_I18N } from './../shared'
import { UPDATE_USER_DATA_I18N } from './config'
import { updateUserAvatar } from './lib'

export const updateUserDataController = async (req: IAppRequest, res: AppResponseType<null>) => {
  const { language } = req
  const basicError = localizedText(UPDATE_USER_DATA_I18N.failedUpdate, language)

  try {
    const username: string | undefined = req.body.username
    const avatarFileBuffer: Buffer | undefined = req.file?.buffer
    const resetAvatar: 'reset' | '' = req.body['reset-avatar']
    const userId = req.app.locals.id

    if (!username && !avatarFileBuffer) {
      return throwHTTPError(
        StatusEnum.BadRequest,
        res,
        localizedText(UPDATE_USER_DATA_I18N.nothingToUpdate, language)
      )
    }

    const user = await UserModel.findById(userId)

    if (!user) {
      return throwHTTPError(StatusEnum.BadRequest, res, localizedText(USER_I18N.userNotFound, language))
    }

    if (username && username !== user.public.username) {
      await user.updateOne({ $set: { 'public.username': username } })
    }

    if (avatarFileBuffer) {
      await updateUserAvatar(avatarFileBuffer, userId, language)
    }

    if (resetAvatar === 'reset') {
      await updateUserAvatar(null, userId, language)
    }

    const contacts = await UserModel.find({ [`personal.contacts.${userId}`]: { $exists: true } }, { _id: 1 }).lean()

    const ids = contacts.map((c) => String(c._id))
    if (ids.length) {
      const socketIds = await getSocketsByUserIds(ids)
      const updatedUserData = await UserModel.findById(userId).lean()
      if (!updatedUserData) return
      socketIds.forEach((socketId) => {
        log.warn(String(socketId))
        getIO().to(socketId).emit<SocketActionsType>('contact-data-changed', transformUserToContact(updatedUserData))
      })
    }

    return res.json({
      payload: null,
      message: { text: localizedText(SHARED_I18N.success, language), silent: true }
    })
  } catch (error: unknown) {
    if (isAppError(error)) {
      return throwHTTPError(error.status, res, error.message, error.silent)
    }

    throwHTTPError(StatusEnum.Server, res, basicError, false, error)
  }
}
