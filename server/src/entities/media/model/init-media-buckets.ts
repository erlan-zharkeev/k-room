import mongoose from 'mongoose'

import { MEDIA_BUCKET_NAMES } from 'entities/media/config'
import { mediaBuckets } from 'entities/media/model/media-bucket'

export const initMediaBuckets = (): void => {
  const db = mongoose.connection.db
  if (!db) throw new Error('Mongo is not connected yet')
  MEDIA_BUCKET_NAMES.forEach((name) => {
    mediaBuckets[name] = new mongoose.mongo.GridFSBucket(db, { bucketName: name })
  })
}
