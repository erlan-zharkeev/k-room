import multer from 'multer'
import { GridFsStorage } from 'multer-gridfs-storage'
import { ENV } from 'shared-config'

export const storage = new GridFsStorage({
  url: ENV.MONGO_HOST,
  file: (req, file) => {
    return {
      filename: file.originalname,
      bucketName: 'media',
      metadata: {
        mimetype: file.mimetype,
        uploadedAt: new Date()
      }
    }
  }
})

export const upload = multer({ storage })
