import mongoose from 'mongoose'

import { StatusEnum } from 'common'

import { AppError } from 'src/shared/lib'

import { MEDIA_BUCKET_NAMES } from './../config'
import { mediaBuckets } from './index'

export const initMediaBuckets = (): void => {
  const db = mongoose.connection.db
  if (!db) throw new AppError(StatusEnum.Server, 'Mongo is not connected yet')
  MEDIA_BUCKET_NAMES.forEach((name) => {
    mediaBuckets[name] = new mongoose.mongo.GridFSBucket(db, { bucketName: name })
  })
}
