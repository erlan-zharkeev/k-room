import { MediaType } from 'common-types'
import { Request } from 'express'
import multer, { FileFilterCallback } from 'multer'
import { GridFsStorage } from 'multer-gridfs-storage'
import path from 'path'
import { ENV } from 'shared-config'
import { v4 as uuidv4 } from 'uuid'

import { MediaBucketName } from '../config'
import { getMediaType } from '.'

export const createUploader = ({
  maxMb,
  supportedMediaType,
  bucketName
}: {
  maxMb: number
  supportedMediaType: MediaType[]
  bucketName: MediaBucketName
}) => {
  const storage = new GridFsStorage({
    url: ENV.MONGO_HOST,
    file: (req, file) => {
      const ext = path.extname(file.originalname)
      const name = bucketName === 'avatar' ? req.app.locals.id : uuidv4()
      const filename = `${bucketName}.${name}${ext}`

      return {
        filename,
        bucketName,
        metadata: { mimetype: file.mimetype, uploadedAt: new Date() }
      }
    }
  })

  return multer({
    storage,
    fileFilter: (_: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
      const type = getMediaType(file)
      const fileSupported = type != null && supportedMediaType.includes(type)
      if (!fileSupported)
        return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', `Unsupported media type: ${file.mimetype}`))
      cb(null, true)
    },
    limits: { fileSize: maxMb * 1024 * 1024 }
  })
}
