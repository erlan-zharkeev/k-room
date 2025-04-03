import { Request, Response } from 'express'
import fs from 'fs'
import { UserModel } from '../models'
import { io } from '../server'
import { getUsersByHasContactId, getSocketsByUserIds } from '../socket'
import {
  StatusEnum,
  SocketActionsType,
  IEventChangeContactsData,
  ServerNotificationMessage,
  ICreateNewPasswordPayload
} from '../@types'
import { getPathToImg, saveImageAndGetPath, throwError } from '../utils'
import { updateTokens } from '../services'

const bcrypt = require('bcryptjs')

class UserController {
  async updateUserData(req: Request, res: Response) {
    try {
      const { username, oldFilename } = req.body
      const userId = req.app.locals.id

      const oldPathFilename = getPathToImg(oldFilename)
      const isImageExist = fs.existsSync(oldPathFilename)
      const isFileStatic = oldPathFilename.includes('static')
      if (!isFileStatic && isImageExist) fs.unlinkSync(getPathToImg(oldFilename))
      const avatarPath = await saveImageAndGetPath(req.file?.buffer, 'avatar', userId)

      const updateUserDataResponse = await UserModel.findOneAndUpdate(
        { _id: userId },
        {
          username,
          avatarPath
        },
        { new: true }
      )
      if (!updateUserDataResponse) return throwError(StatusEnum.BadRequest, res, ServerNotificationMessage.UsersFind)

      const usersHasCurrentContact = await getUsersByHasContactId(userId)
      const usersIdsFromUsers = usersHasCurrentContact.map((user) => user.id)
      const sockets = await getSocketsByUserIds(usersIdsFromUsers)

      const updatedUserData = {
        username: updateUserDataResponse.username,
        avatarPath: updateUserDataResponse.avatarPath
      }
      const payload: IEventChangeContactsData = {
        id: userId,
        ...updatedUserData
      }
      sockets.forEach((socketId: string) => {
        io.to(socketId).emit<SocketActionsType>('contact-data-changed', payload)
      })

      return res.json({
        userData: updatedUserData,
        message: ServerNotificationMessage.UserDataUpdated
      })
    } catch {
      throwError(StatusEnum.BadRequest, res, ServerNotificationMessage.FailedUserDataUpdate)
    }
  }

  async getUserData(req: Request, res: Response) {
    try {
      const userId = req.app.locals.id
      const user = await UserModel.findOne({ _id: userId })
      if (!user) return throwError(StatusEnum.BadRequest, res, ServerNotificationMessage.UserNotFound)
      await updateTokens(user._id.toString(), res)
      return res.json({
        userData: {
          username: user.username,
          role: user.role,
          email: user.email,
          id: user._id,
          avatarPath: user.avatarPath,
          infoItems: user.infoItems
        },
        settings: user.settings
      })
    } catch {
      throwError(StatusEnum.BadRequest, res, ServerNotificationMessage.FailedGetUserData)
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { query, password } = req.body as ICreateNewPasswordPayload
      const hashedPassword = await bcrypt.hash(password, 6)
      if (!hashedPassword) return throwError(StatusEnum.BadRequest, res, ServerNotificationMessage.FailedPassHash)

      const user = await UserModel.findOne({ 'codes.passwordRecovery.query.value': query })
      if (!user) throwError(StatusEnum.BadRequest, res, ServerNotificationMessage.FailedResetPassword)

      await user?.updateOne({
        $set: {
          'codes.passwordRecovery.query.value': null,
          'codes.nextRequestPossibleAt': null,
          password: hashedPassword
        }
      })

      return res.json({ message: ServerNotificationMessage.PasswordReset })
    } catch {
      return throwError(StatusEnum.BadRequest, res, ServerNotificationMessage.CommonServerError)
    }
  }
}

export const controller = new UserController()
