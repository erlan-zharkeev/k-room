import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { Status } from '../../../types'
import ENV from '../ENV'
import { Messages } from '../types/Messages'
import throwError from '../utils/throwError'
import db from './../services/database'
import { UserModel } from '../models/user.model'

const fs = require('fs')
const Grid = require('gridfs-stream')

const connection = db.connection

let gfs = null as any
let gridfsBucket = null as any

connection.once('open', () => {
  gridfsBucket = new mongoose.mongo.GridFSBucket(connection.db, {
    bucketName: 'uploads'
  })

  gfs = Grid(connection.db, mongoose.mongo)
  gfs.collection('uploads')
})

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

  async showFiles(req: Request, res: Response) {
    gfs.files.findOne({ filename: req.params.filename }, (_: any, file: any) => {
      if (!file || file.length === 0) return throwError(Status.NOT_FOUND, res, Messages.noFilesExist)
      if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
        const readstream = gridfsBucket.openDownloadStream(file._id)
        readstream.pipe(res)
      } else throwError(Status.NOT_FOUND, res, Messages.notImage)
    })
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
      return res.json({ message: Messages.success, silent: true })
    } catch (e) {
      throwError(Status.NOT_FOUND, res, Messages.notImage)
    }
  }
}

export default new CommonController()
