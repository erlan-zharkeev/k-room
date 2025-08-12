import { StatusEnum } from 'common-types'
import { RequestMulterFile } from 'entities/media'
import { UserModel } from 'entities/user'
import type { Request, Response } from 'express'
import { ServerNotificationMessage } from 'shared-config'
import { throwHTTPError } from 'shared-lib'

import { USER_MESSAGE } from '../~shared'
import { MESSAGE } from './config'

export const updateUserData = async (req: Request, res: Response) => {
  try {
    const username: string | undefined = req.body.username
    const avatarFile: RequestMulterFile | undefined = req.file
    const userId = req.app.locals.id

    if (!username && !avatarFile) {
      return throwHTTPError(StatusEnum.BadRequest, res, MESSAGE.nothingToUpdate)
    }

    const user = await UserModel.findById(userId)

    if (!user) {
      return throwHTTPError(StatusEnum.BadRequest, res, USER_MESSAGE.userNotFound)
    }

    if (username && username !== user.public.username) {
      await user.updateOne({ $set: { 'public.username': username } })
    }

    return res.json({ data: { username }, silent: true })

    // const usersHasCurrentContact = await getUsersByHasContactId(userId)
    // const usersIdsFromUsers = usersHasCurrentContact.map((user) => user.id)
    // const sockets = await getSocketsByUserIds(usersIdsFromUsers)
    // const updatedUserData = {
    //   username: updateUserDataResponse.username,
    //   avatar: updateUserDataResponse.avatar
    // }
    // const payload: IEventChangeContactsData = {
    //   id: userId,
    //   ...updatedUserData
    // }
    // const io = getIO()
    // sockets.forEach((socketId: string) => {
    //   io.to(socketId).emit<SocketActionsType>('contact-data-changed', payload)
    // })
    // return res.json({
    //   userData: updatedUserData,
    //   message: ServerNotificationMessage.UserDataUpdated,
    //   silent: true
    // })
  } catch {
    throwHTTPError(StatusEnum.BadRequest, res, ServerNotificationMessage.FailedUserDataUpdate)
  }
}
