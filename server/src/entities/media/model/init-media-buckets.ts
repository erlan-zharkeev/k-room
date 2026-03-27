import mongoose from 'mongoose'

import { mediaBuckets } from 'entities/media'
import { MEDIA_BUCKET_NAMES } from 'entities/media/config'

export const initMediaBuckets = (): void => {
  const db = mongoose.connection.db
  if (!db) throw new Error('Mongo is not connected yet')
  MEDIA_BUCKET_NAMES.forEach((name) => {
    mediaBuckets[name] = new mongoose.mongo.GridFSBucket(db, { bucketName: name })
  })
}
