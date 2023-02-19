import { Request, Response } from 'express'
import { Status } from '../../../types'
import { Messages } from '../types/Messages'
import throwError from '../utils/throwError'
import ENV from '../ENV'
import db from './../services/database'
import mongoose from 'mongoose'

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
      console.log(path, 'path')
      fs.readdir('./', (err: any, files: any) => {
        if (err) throw err // не прочитать содержимое папки
        console.log('В папке находятся файлы:' + files)
      })
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
}

export default new CommonController()
