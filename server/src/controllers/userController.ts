import { UserModel } from '../models/user.model'
import { Request, Response } from 'express'
import throwError from '../utils/throwError'
import { Messages } from '../types/Messages'
import { SocketActions, Status } from '../../../types'
import { io } from '../server'
import ENV from '../ENV'
import getSocketsByUsersArray from '../socket/helpers/getSocketsByUsersArray'
import getUsersByHasContactId from '../socket/helpers/getUsersByHasContactId'
const bcrypt = require('bcryptjs')

class UserController {
  async updateUserSettings(req: Request, res: Response) {
    try {
      const { userId, type, value } = req.body

      const query = {} as any
      query['settings.' + type] = value
      await UserModel.findOneAndUpdate({ _id: userId }, query, { new: true })
      return res.json()
    } catch (e) {
      console.log(e)
      throwError(Status.BAD_REQUEST, res, Messages.updateSettings)
    }
  }

  async getUserData(req: Request, res: Response) {
    try {
      const { id } = req.body.decoded
      const user = await UserModel.findOne({ _id: id })
      if (!user) return throwError(Status.BAD_REQUEST, res, Messages.userNotFound)
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
    } catch (e: any) {
      throwError(Status.BAD_REQUEST, res, Messages.failedToGetUserData)
    }
  }

  async updateUserData(req: any, res: Response) {
    try {
      const { userId, username } = req.body

      const filename = req.file?.filename ?? null

      const newUserData: any = {
        username
      }

      if (filename) newUserData.avatar = `${ENV.SERVER_URL}/image/${filename}`

      const updateUserDataResponse = await UserModel.findOneAndUpdate({ _id: userId }, newUserData, { new: true })

      if (!updateUserDataResponse) return throwError(Status.BAD_REQUEST, res, Messages.usersFindFailed)

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
        message: Messages.userDataSuccess
      })
    } catch (e: any) {
      console.log(e)
      throwError(Status.BAD_REQUEST, res, Messages.userDataUpdateFailedCommonError)
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { query, password } = req.body
      const hashedPassword = await bcrypt.hash(password, 6)
      if (!hashedPassword) return throwError(Status.BAD_REQUEST, res, Messages.passHashFailed)

      const user = await UserModel.findOne({ 'codes.passwordRecovery.query.value': query })
      if (!user) throwError(Status.BAD_REQUEST, res, Messages.failedToResetPassword)

      await user?.updateOne({
        $set: {
          'codes.passwordRecovery.query.value': null,
          'codes.nextRequestPossibleAt': null,
          password: hashedPassword
        }
      })

      return res.json({ message: Messages.passwordResetSuccess })
    } catch (e: any) {
      console.log(e)
      return throwError(Status.BAD_REQUEST, res, Messages.commonServerError)
    }
  }
}

export default new UserController()
