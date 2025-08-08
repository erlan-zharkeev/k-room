import { StatusEnum } from 'common-types'
import type { Request, Response } from 'express'
import { ServerNotificationMessage } from 'shared-config'
import { throwHTTPError } from 'shared-lib'

export const updateUserData = async (req: Request, res: Response) => {
  try {
    // const { username, oldFilename } = req.body
    // const userId = req.app.locals.id
    // const oldPathFilename = getPathToImg(oldFilename)
    // const updateData: { username: string; avatarPath?: string } = {
    //   username
    // }
    // if (req.file) {
    //   const isImageExist = fs.existsSync(oldPathFilename)
    //   const isFileNotStatic = !oldPathFilename.includes('static')
    //   if (isImageExist && isFileNotStatic) fs.unlinkSync(getPathToImg(oldFilename))
    //   const avatarPath = await saveImageAndGetPath(req.file.buffer, 'avatar')
    //   if (avatarPath) {
    //     updateData.avatarPath = avatarPath
    //   }
    // }
    // const updateUserDataResponse = await UserModel.findOneAndUpdate({ _id: userId }, { ...updateData }, { new: true })
    // if (!updateUserDataResponse) return throwHTTPError(StatusEnum.BadRequest, res, ServerNotificationMessage.UsersFind)
    // const usersHasCurrentContact = await getUsersByHasContactId(userId)
    // const usersIdsFromUsers = usersHasCurrentContact.map((user) => user.id)
    // const sockets = await getSocketsByUserIds(usersIdsFromUsers)
    // const updatedUserData = {
    //   username: updateUserDataResponse.username,
    //   avatarPath: updateUserDataResponse.avatarPath
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
