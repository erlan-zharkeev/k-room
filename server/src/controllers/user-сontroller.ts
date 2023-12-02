import { Request, Response } from 'express'
import fs from 'fs'
import { UserModel } from '../models'
import { io } from '../server'
import { getUsersByHasContactId, getSocketsByUserIds } from '../socket'
import { SharpSettingsKey, Status, NotificationMessage, SocketActionsPayload, SocketActions } from '../@types'
import { getPathToImg, saveImageAndGetPath, throwError } from '../utils'

const bcrypt = require('bcryptjs')

class UserController {
  async updateUserData(req: any, res: Response) {
    try {
      const { userId, username, oldFilename } = req.body

      const oldPathFilename = getPathToImg(oldFilename)
      const isImageExist = fs.existsSync(oldPathFilename)
      const isFileStatic = oldPathFilename.includes('static')
      if (!isFileStatic && isImageExist) fs.unlinkSync(getPathToImg(oldFilename))

      const avatar = saveImageAndGetPath(req.file?.buffer, SharpSettingsKey.avatar, userId)

      const newUserData: any = {
        username,
        avatar
      }

      const updateUserDataResponse = await UserModel.findOneAndUpdate({ _id: userId }, newUserData, { new: true })

      if (!updateUserDataResponse) return throwError(Status.badRequest, res, NotificationMessage.usersFind)

      const usersHasCurrentContact = await getUsersByHasContactId(userId)
      const usersIdsFromUsers = usersHasCurrentContact.map((user) => user.id)
      const sockets = await getSocketsByUserIds(usersIdsFromUsers)

      const updatedUserData = {
        username: updateUserDataResponse.username,
        avatarPath: updateUserDataResponse.avatarPath
      }
      const payload: SocketActionsPayload['changeContactsData'] = {
        id: userId,
        ...updatedUserData
      }
      sockets.forEach((socketId: string) => {
        io.to(socketId).emit(SocketActions.CHANGE_CONTACTS_DATA, payload)
      })

      return res.json({
        userData: updatedUserData,
        message: NotificationMessage.userDataUpdated
      })
    } catch {
      throwError(Status.badRequest, res, NotificationMessage.failedUserDataUpdate)
    }
  }

  async getUserData(req: Request, res: Response) {
    try {
      const { id } = req.body.decoded
      const user = await UserModel.findOne({ _id: id })
      if (!user) return throwError(Status.badRequest, res, NotificationMessage.userNotFound)
      return res.json({
        userData: {
          username: user.username,
          email: user.email,
          id: user._id,
          avatarPath: user.avatarPath,
          infoItems: user.infoItems
        },
        settings: user.settings
      })
    } catch {
      throwError(Status.badRequest, res, NotificationMessage.failedGetUserData)
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { query, password } = req.body
      const hashedPassword = await bcrypt.hash(password, 6)
      if (!hashedPassword) return throwError(Status.badRequest, res, NotificationMessage.failedPassHash)

      const user = await UserModel.findOne({ 'codes.passwordRecovery.query.value': query })
      if (!user) throwError(Status.badRequest, res, NotificationMessage.failedResetPassword)

      await user?.updateOne({
        $set: {
          'codes.passwordRecovery.query.value': null,
          'codes.nextRequestPossibleAt': null,
          password: hashedPassword
        }
      })

      return res.json({ message: NotificationMessage.passwordReset })
    } catch {
      return throwError(Status.badRequest, res, NotificationMessage.commonServerError)
    }
  }
}

export const controller = new UserController()
