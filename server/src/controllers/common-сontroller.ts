import { Request, Response } from 'express'
import { UserModel } from '../models'
import { Status, NotificationMessage } from '../@types'
import { getPathToImg, throwError } from '../utils'

const fs = require('fs')

class CommonController {
  async imagesHandler(req: Request, res: Response) {
    try {
      const filename = req.query.img as string
      const resolution = filename.split('.')[1]
      const path = getPathToImg(filename)
      if (!fs.existsSync(path)) return throwError(Status.notFound, res, NotificationMessage.noFilesExist)
      res.writeHead(200, { 'content-type': `image/${resolution}` })
      fs.createReadStream(path).pipe(res)
    } catch {
      return throwError(Status.notFound, res, NotificationMessage.noFilesExist)
    }
  }

  async readInfoHandler(req: Request, res: Response) {
    try {
      const { currentInfoId, userId } = req.body
      await UserModel.findOneAndUpdate(
        {
          _id: userId,
          infoItems: {
            $elemMatch: {
              id: currentInfoId
            }
          }
        },
        {
          $set: {
            'infoItems.$[outer].read': 'read'
          }
        },
        {
          new: true,
          arrayFilters: [{ 'outer.id': currentInfoId }]
        }
      )
      return res.json({ message: NotificationMessage.success, silent: true })
    } catch {
      throwError(Status.notFound, res, NotificationMessage.notImage)
    }
  }
}

export const controller = new CommonController()
