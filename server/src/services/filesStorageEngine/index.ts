import multer from 'multer'
import ENV from './../../ENV'
const path = require('path')
const crypto = require('crypto')
const { GridFsStorage } = require('multer-gridfs-storage')

export const storage = new GridFsStorage({
  url: ENV.MONGO_HOST,
  cache: false,
  file: (req: any, file: any) => {
    return new Promise(async (resolve, reject) => {
      crypto.randomBytes(16, async (err: any, buf: any) => {
        if (err) return reject(err)
        const filename = buf.toString('hex') + path.extname(file.originalname)
        const fileInfo = {
          filename,
          bucketName: 'uploads'
        }
        resolve(fileInfo)
      })
    })
  }
})

const upload = multer({ storage })

export default upload
