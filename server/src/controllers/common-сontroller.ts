import { Request, Response } from 'express'
import { UserModel } from '../models'
import { ServerNotificationMessage, StatusEnum } from '../@types'
import { getPathToImg, throwError } from '../utils'
import { getInfoItem } from '../services'

const fs = require('fs')

class CommonController {
  async getImage(req: Request, res: Response) {
    try {
      const filename = req.query.img as string
      const resolution = filename.split('.')[1]
      const path = getPathToImg(filename)
      if (!fs.existsSync(path)) return throwError(StatusEnum.NotFound, res, ServerNotificationMessage.NoFilesExist)
      res.writeHead(200, { 'content-type': `image/${resolution}` })
      fs.createReadStream(path).pipe(res)
    } catch {
      return throwError(StatusEnum.NotFound, res, ServerNotificationMessage.NoFilesExist)
    }
  }

  async readInfoItem(req: Request, res: Response) {
    try {
      const { id } = req.body
      const userId = req.app.locals.id
      await UserModel.findOneAndUpdate(
        {
          _id: userId,
          infoNotifications: {
            $elemMatch: {
              id
            }
          }
        },
        {
          $set: {
            'infoNotifications.$[outer].read': true
          }
        },
        {
          new: true,
          arrayFilters: [{ 'outer.id': id }]
        }
      )
      return res.json({ message: ServerNotificationMessage.Success, silent: true })
    } catch {
      throwError(StatusEnum.NotFound, res, ServerNotificationMessage.NotImage)
    }
  }

  async getInfoItem(req: Request, res: Response) {
    try {
      const ids = req.query.ids as string
      if (!ids) return throwError(StatusEnum.BadRequest, res, ServerNotificationMessage.InfoIdsNotProvided)

      const idArray = ids.split(',').map((id) => id.trim())

      const infoNotifications = idArray.map((id) => getInfoItem(id))

      return res.json(infoNotifications)
    } catch {
      throwError(StatusEnum.NotFound, res, ServerNotificationMessage.NoFilesExist)
    }
  }
}

export const controller = new CommonController()
