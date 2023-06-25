import { Request, Response } from 'express'
import { Status } from '../../../types'
import { ErrorMessages, SuccessMessages } from '../types/Messages'
import throwError from '../utils/throwError'
import { UserModel } from '../models/user.model'
import { getPathToImg } from '../utils/getPathToImg'
const fs = require('fs')

class CommonController {
  async imagesHandler(req: Request, res: Response) {
    try {
      const filename = req.query.img as string
      const resolution = filename.split('.')[1]
      const path = getPathToImg(filename)
      if (!fs.existsSync(path)) return throwError(Status['not-found'], res, ErrorMessages.noFilesExist)
      res.writeHead(200, { 'content-type': `image/${resolution}` })
      fs.createReadStream(path).pipe(res)
    } catch {
      return throwError(Status['not-found'], res, ErrorMessages.noFilesExist)
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
      return res.json({ message: SuccessMessages.success, silent: true })
    } catch {
      throwError(Status['not-found'], res, ErrorMessages.notImage)
    }
  }
}

export default new CommonController()
