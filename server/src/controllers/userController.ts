import { UserModel } from '../models/user.model'
import { Request, Response } from 'express'
import throwError from '../utils/throwError'
import { ErrorMessages, SuccessMessages } from '../types/Messages'
import { SocketActions, SocketActionsPayload, Status } from '../../../types'
import { io } from '../server'
import getSocketsByUserIds from '../socket/helpers/getters/getSocketsByUserIds'
import { getUsersByHasContactId } from '../socket/helpers/getters/getUsersByHasContactId'
import { getPathToImg } from '../utils/getPathToImg'
import fs from 'fs'
import saveImageAndGetPath from '../utils/saveImageAndGetPath'
import { SharpSettingsKey } from '../types/Constants'

const bcrypt = require('bcryptjs')

class UserController {
  async updateUserData(req: Request, res: Response) {
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

      if (!updateUserDataResponse) return throwError(Status.badRequest, res, ErrorMessages.usersFind)

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
        message: SuccessMessages.userDataUpdated
      })
    } catch {
      throwError(Status.badRequest, res, ErrorMessages.failedUserDataUpdate)
    }
  }

  async getUserData(req: Request, res: Response) {
    try {
      const { id } = req.body.decoded
      const user = await UserModel.findOne({ _id: id })
      if (!user) return throwError(Status.badRequest, res, ErrorMessages.userNotFound)
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
      throwError(Status.badRequest, res, ErrorMessages.failedGetUserData)
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { query, password } = req.body
      const hashedPassword = await bcrypt.hash(password, 6)
      if (!hashedPassword) return throwError(Status.badRequest, res, ErrorMessages.failedPassHash)

      const user = await UserModel.findOne({ 'codes.passwordRecovery.query.value': query })
      if (!user) throwError(Status.badRequest, res, ErrorMessages.failedResetPassword)

      await user?.updateOne({
        $set: {
          'codes.passwordRecovery.query.value': null,
          'codes.nextRequestPossibleAt': null,
          password: hashedPassword
        }
      })

      return res.json({ message: SuccessMessages.passwordReset })
    } catch {
      return throwError(Status.badRequest, res, ErrorMessages.commonServerError)
    }
  }
}

export default new UserController()
