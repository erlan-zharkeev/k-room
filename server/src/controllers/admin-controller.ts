import { Request, Response } from 'express'
import { CallModel, ChatRoomModel, MessageModel, UserModel } from '../models'
import { Status } from '../@types'
import { throwError } from '../utils'
import { loadFixtures } from '../fixtures'
import { ServerNotificationMessage } from '../@enums'

class AdminController {
  async getAppData(_: Request, res: Response) {
    try {
      const users = await UserModel.find()
      const calls = await CallModel.find()
      const chatRooms = await ChatRoomModel.find()
      const messages = await MessageModel.find()
      if (!users || !calls || !chatRooms || !messages) throw new Error()
      return res.json({
        users,
        calls,
        chatRooms,
        messages
      })
    } catch (e: unknown) {
      throwError(Status.BadRequest, res, ServerNotificationMessage.FailedToGetData)
    }
  }

  async resetDB(_: Request, res: Response) {
    try {
      await Promise.all([
        UserModel.deleteMany({ role: { $ne: 'admin' } }),
        CallModel.deleteMany({}),
        ChatRoomModel.deleteMany({}),
        MessageModel.deleteMany({})
      ])
      return res.json({
        message: ServerNotificationMessage.DBRestored
      })
    } catch (e: unknown) {
      throwError(Status.BadRequest, res, ServerNotificationMessage.DBResetFailed)
    }
  }

  async applyFixtures(_: Request, res: Response) {
    try {
      loadFixtures(false)
      return res.json({
        message: ServerNotificationMessage.FixturesAreApplied
      })
    } catch (e: unknown) {
      throwError(Status.BadRequest, res, ServerNotificationMessage.DBResetFailed)
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const deleteUserId = req.body.deleteUserId
      const user = await UserModel.findById(deleteUserId)
      if (!user) {
        return throwError(Status.NotFound, res, ServerNotificationMessage.UserNotFound)
      }
      await UserModel.findByIdAndDelete(deleteUserId)
      return res.json({
        message: ServerNotificationMessage.UserDeleteSuccess
      })
    } catch {
      throwError(Status.BadRequest, res, ServerNotificationMessage.DeleteUserFailed)
    }
  }

  async updateUserData(req: Request, res: Response) {
    try {
      const { id, username, email, role, confirmed } = req.body.userData
      let user = await UserModel.findById(id)
      if (!user) {
        return throwError(Status.NotFound, res, ServerNotificationMessage.UserNotFound)
      }

      user.username = username
      user.email = email
      user.role = role
      user.confirmed = confirmed

      await user.save()

      return res.json({
        message: ServerNotificationMessage.UserUpdateSuccess,
        updatedUser: user
      })
    } catch {}
  }
}

export const controller = new AdminController()
