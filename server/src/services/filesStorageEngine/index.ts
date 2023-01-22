import multer from 'multer'
import ENV from './../../ENV'

const path = require('path')
const crypto = require('crypto')
const { GridFsStorage } = require('multer-gridfs-storage')

const storage = new GridFsStorage({
  url: ENV.MONGO_HOST,
  file: async (req: any, file: any) => {
    return await new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err: any, buf: any) => {
        if (err) {
          return reject(err)
        }
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
