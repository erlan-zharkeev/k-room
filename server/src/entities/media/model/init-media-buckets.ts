import mongoose from 'mongoose'

import { mediaBuckets } from 'src/entities/media'
import { MEDIA_BUCKET_NAMES } from 'src/entities/media/config'

export const initMediaBuckets = (): void => {
  const db = mongoose.connection.db
  if (!db) throw new Error('Mongo is not connected yet')
  MEDIA_BUCKET_NAMES.forEach((name) => {
    mediaBuckets[name] = new mongoose.mongo.GridFSBucket(db, { bucketName: name })
  })
}
