import { UserModel } from '../models/user.model'
import { Request, Response } from 'express'
import throwError from '../utils/throwError'
import { ErrorMessages, SuccessMessages } from '../types/Messages'
import { SocketActions, Status } from '../../../types'
import { io } from '../server'
import getSocketsByUsersArray from '../socket/helpers/getSocketsByUsersArray'
import getUsersByHasContactId from '../socket/helpers/getUsersByHasContactId'
import { getPathToImg } from '../utils/getPathToImg'
import fs from 'fs'
import saveAndGetImagePath from '../utils/saveAndGetImagePath'
import { SharpKey } from '../types/Constants'

const bcrypt = require('bcryptjs')

class UserController {
  async updateUserData(req: Request, res: Response) {
    try {
      const { userId, username, oldFilename } = req.body

      const oldPathFilename = getPathToImg(oldFilename)
      const isImageExist = fs.existsSync(oldPathFilename)
      const isFileStatic = oldPathFilename.includes('static')
      if (!isFileStatic && isImageExist) fs.unlinkSync(getPathToImg(oldFilename))

      const avatar = saveAndGetImagePath(req.file?.buffer, SharpKey.avatar)

      const newUserData: any = {
        username,
        avatar
      }

      const updateUserDataResponse = await UserModel.findOneAndUpdate({ _id: userId }, newUserData, { new: true })

      if (!updateUserDataResponse) return throwError(Status.BAD_REQUEST, res, ErrorMessages.usersFind)

      const usersHasCurrentContact = await getUsersByHasContactId(userId)
      const usersIdsFromUsers = usersHasCurrentContact.map((user) => user.id)
      const sockets = await getSocketsByUsersArray(usersIdsFromUsers)

      const updatedUserData = {
        username: updateUserDataResponse.username,
        avatar: updateUserDataResponse.avatar
      }

      sockets.forEach((socketId: string) => {
        io.to(socketId).emit(SocketActions.CHANGE_CONTACTS_DATA, {
          id: userId,
          ...updatedUserData
        })
      })

      return res.json({
        userData: updatedUserData,
        message: SuccessMessages.userDataUpdated
      })
    } catch {
      throwError(Status.BAD_REQUEST, res, ErrorMessages.failedUserDataUpdate)
    }
  }

  async getUserData(req: Request, res: Response) {
    try {
      const { id } = req.body.decoded
      const user = await UserModel.findOne({ _id: id })
      if (!user) return throwError(Status.BAD_REQUEST, res, ErrorMessages.userNotFound)
      return res.json({
        userData: {
          username: user.username,
          email: user.email,
          id: user._id,
          avatar: user.avatar,
          infoItems: user.infoItems
        },
        settings: user.settings
      })
    } catch {
      throwError(Status.BAD_REQUEST, res, ErrorMessages.failedGetUserData)
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { query, password } = req.body
      const hashedPassword = await bcrypt.hash(password, 6)
      if (!hashedPassword) return throwError(Status.BAD_REQUEST, res, ErrorMessages.failedPassHash)

      const user = await UserModel.findOne({ 'codes.passwordRecovery.query.value': query })
      if (!user) throwError(Status.BAD_REQUEST, res, ErrorMessages.failedResetPassword)

      await user?.updateOne({
        $set: {
          'codes.passwordRecovery.query.value': null,
          'codes.nextRequestPossibleAt': null,
          password: hashedPassword
        }
      })

      return res.json({ message: SuccessMessages.passwordReset })
    } catch {
      return throwError(Status.BAD_REQUEST, res, ErrorMessages.commonServerError)
    }
  }
}

export default new UserController()
