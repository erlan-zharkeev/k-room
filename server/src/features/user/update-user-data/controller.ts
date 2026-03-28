import { SocketActionsType, StatusEnum } from 'common'

import { getSocketsByUserIds, transformUserToContact, USER_MESSAGE } from 'src/features/user'
import { updateUserAvatar } from 'src/features/user/update-user-data'
import { I18N_UPDATE_USER_DATA_MESSAGE } from 'src/features/user/update-user-data'

import { UserModel } from 'src/entities/user'

import { AppResponseType, IAppRequest, SHARED_MESSAGE } from 'src/shared/config'
import { getIO, getLocalizedText, log, serverCaptureSentryException, throwHTTPError } from 'src/shared/lib'

export const updateUserData = async (req: IAppRequest, res: AppResponseType<null>) => {
  const language = req.language

  try {
    const username: string | undefined = req.body.username
    const avatarFileBuffer: Buffer | undefined = req.file?.buffer
    const resetAvatar: 'reset' | '' = req.body['reset-avatar']
    const userId = req.app.locals.id

    if (!username && !avatarFileBuffer) {
      return throwHTTPError(StatusEnum.BadRequest, res, getLocalizedText(I18N_UPDATE_USER_DATA_MESSAGE.nothingToUpdate, language))
    }

    const user = await UserModel.findById(userId)

    if (!user) {
      return throwHTTPError(StatusEnum.BadRequest, res, getLocalizedText(USER_MESSAGE.userNotFound, language))
    }

    if (username && username !== user.public.username) {
      await user.updateOne({ $set: { 'public.username': username } })
    }

    if (avatarFileBuffer) {
      await updateUserAvatar(avatarFileBuffer, userId, res, language)
    }

    if (resetAvatar === 'reset') {
      await updateUserAvatar(null, userId, res, language)
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
      message: { text: getLocalizedText(SHARED_MESSAGE.success, language), silent: true }
    })
  } catch (error: unknown) {
    log.error(String(error))
    serverCaptureSentryException(error)
    throwHTTPError(StatusEnum.Server, res, getLocalizedText(I18N_UPDATE_USER_DATA_MESSAGE.failedUpdate, language))
  }
}
