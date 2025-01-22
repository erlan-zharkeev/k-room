import { Request, Response } from 'express'
import { CallModel, ChatRoomModel, MessageModel, UserModel } from '../models'
import { Status, NotificationMessage } from '../@types'
import { throwError } from '../utils'
import { loadFixtures } from '../fixtures'

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
      throwError(Status.badRequest, res, NotificationMessage.failedToGetData)
    }
  }

  async resetDB(_: Request, res: Response) {
    try {
      await Promise.all([
        UserModel.deleteMany({ role: { $ne: 'admin' } }),
        CallModel.deleteMany({}),
        ChatRoomModel.deleteMany({}),
        MessageModel.deleteMany({}),
      ]);
      return res.json({
        message: NotificationMessage.dbRestored,
      });
    } catch (e: unknown) {
      throwError(Status.badRequest, res, NotificationMessage.dbResetFailed)
    }
  }

  async applyFixtures(_: Request, res: Response) {
    try {
      loadFixtures(false)
      return res.json({
        message: NotificationMessage.fixturesAreApplied,
      });
    } catch (e: unknown) {
      throwError(Status.badRequest, res, NotificationMessage.dbResetFailed)
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const deleteUserId = req.body.deleteUserId
      const user = await UserModel.findById(deleteUserId);
      if (!user) {
        return throwError(Status.notFound, res, NotificationMessage.userNotFound);
      }
      await UserModel.findByIdAndDelete(deleteUserId);
      return res.json({
        message: NotificationMessage.userDeleteSuccess,
      });
    } catch {
      throwError(Status.badRequest, res, NotificationMessage.deleteUserFailed)
    }
  }

  async updateUserData(req: Request, res: Response) {
    try {
      const { id, username, email, role, confirmed } = req.body.userData;
      let user = await UserModel.findById(id);
      if (!user) {
        return throwError(Status.notFound, res, NotificationMessage.userNotFound);
      }

      user.username = username;
      user.email = email;
      user.role = role;
      user.confirmed = confirmed;

      await user.save();

      return res.json({
        message: NotificationMessage.userUpdateSuccess,
        updatedUser: user,
      });
    } catch {
    }
  }
}

export const controller = new AdminController()
