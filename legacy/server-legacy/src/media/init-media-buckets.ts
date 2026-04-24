import { REQ_STATUS } from 'common'
import mongoose from 'mongoose'

import { AppError } from 'src/shared/lib/app-error'

import { MEDIA_BUCKET_NAMES } from './config/constants'
import { mediaBuckets } from './media-bucket'

export const initMediaBuckets = (): void => {
  const db = mongoose.connection.db
  if (!db) throw new AppError(REQ_STATUS.server, 'Mongo is not connected yet')
  MEDIA_BUCKET_NAMES.forEach((name) => {
    mediaBuckets[name] = new mongoose.mongo.GridFSBucket(db, { bucketName: name })
  })
}
