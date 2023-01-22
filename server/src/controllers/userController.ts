import { UserModel } from '../models/user.model'
import { Request, Response } from 'express'
import throwError from '../utils/throwError'
import { Messages } from '../types/Messages'
import { SocketActions, Status } from '../../../types'
import { io } from '../server'
import ENV from '../ENV'
import getSocketsByUsersArray from '../socket/helpers/getSocketsByUsersArray'
import getUsersByHasContactId from '../socket/helpers/getUsersByHasContactId'

class UserController {
  async updateUserSettings(req: Request, res: Response) {
    try {
      const { userId, type, value } = req.body

      const query = {} as any
      query['settings.' + type] = value

      await UserModel.findOneAndUpdate({ _id: userId }, query, { new: true })

      return res.json()
    } catch (e) {
      throwError(Status.BAD_REQUEST, res, Messages.updateSettings)
    }
  }

  async getUserData(req: Request, res: Response) {
    const { id } = req.body.decoded
    const user = await UserModel.findOne({ _id: id })
    if (!user) return throwError(Status.BAD_REQUEST, res, Messages.userNotFound)
    return res.json({
      userData: {
        username: user.username,
        email: user.email,
        id: user._id,
        avatar: user.avatar
      }
    })
  }

  async updateUserData(req: any, res: Response) {
    try {
      const { userId, username } = req.body

      const filename = req.file?.filename ?? null

      const newUserData: any = {
        username
      }

      if (filename) newUserData.avatar = `${ENV.HOST}:${ENV.SERVER_PORT}/api/image/${filename}`

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
}

export default new UserController()
