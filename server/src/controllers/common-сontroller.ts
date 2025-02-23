import { Request, Response } from 'express'
import { UserModel } from '../models'
import { ServerNotificationMessage, Status } from '../@types'
import { getPathToImg, throwError } from '../utils'

const fs = require('fs')

class CommonController {
  async imagesHandler(req: Request, res: Response) {
    try {
      const filename = req.query.img as string
      const resolution = filename.split('.')[1]
      const path = getPathToImg(filename)
      if (!fs.existsSync(path)) return throwError(Status.NotFound, res, ServerNotificationMessage.NoFilesExist)
      res.writeHead(200, { 'content-type': `image/${resolution}` })
      fs.createReadStream(path).pipe(res)
    } catch {
      return throwError(Status.NotFound, res, ServerNotificationMessage.NoFilesExist)
    }
  }

  async readInfoHandler(req: Request, res: Response) {
    try {
      const { currentInfoId } = req.body
      const userId = req.app.locals.id
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
      return res.json({ message: ServerNotificationMessage.Success, silent: true })
    } catch {
      throwError(Status.NotFound, res, ServerNotificationMessage.NotImage)
    }
  }
}

export const controller = new CommonController()
