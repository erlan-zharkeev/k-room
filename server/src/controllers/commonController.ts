import { Request, Response } from 'express'
import { Status } from '../../../types'
import { Messages } from '../types/Messages'
import throwError from '../utils/throwError'
import ENV from '../ENV'

const fs = require('fs')

class CommonController {
  async imagesHandler(req: Request, res: Response) {
    try {
      const filename = req.query.img as string
      const resolution = filename.split('.')[1]
      const path = `${ENV.SERVER_ASSETS_PATH}/img/${filename}`
      if (!fs.existsSync(path)) return throwError(Status.NOT_FOUND, res, Messages.noFilesExist)
      res.writeHead(200, { 'content-type': `image/${resolution}` })
      fs.createReadStream(path).pipe(res)
    } catch (e) {
      return throwError(Status.NOT_FOUND, res, Messages.noFilesExist)
    }
  }
}

export default new CommonController()
