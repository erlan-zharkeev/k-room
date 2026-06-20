import { REQ_STATUS, type MediaBucketName } from 'global-shared'
import mongoose from 'mongoose'

import { AppError } from 'src/shared/lib/app-error'

import { MEDIA_BUCKET_NAMES } from '../media.constants'
import { COMMON_MEDIA_I18N } from '../media.i18n'
import type { MongooseGridFSBucket, StreamMediaBucketFile } from '../media.types'

const mediaBuckets: Record<MediaBucketName, MongooseGridFSBucket | null> = {
  doc: null,
  image: null,
  audio: null,
  video: null
}

export const resolveRequiredMediaBucket = (bucketName: MediaBucketName) => {
  const bucket = mediaBuckets[bucketName]

  if (!bucket) {
    throw new AppError(REQ_STATUS.notFound, COMMON_MEDIA_I18N.failedToFindBucket)
  }

  return bucket
}

export const findMediaBucketFileById = async (
  bucketName: MediaBucketName,
  fileId: mongoose.Types.ObjectId
): Promise<StreamMediaBucketFile | null> => {
  const bucket = resolveRequiredMediaBucket(bucketName)
  const file = await bucket.find({ _id: fileId }).next()

  return file ? { bucket, file } : null
}

export const initMediaBuckets = () => {
  const db = mongoose.connection.db

  if (!db) {
    throw new AppError(REQ_STATUS.server, 'Mongo is not connected yet')
  }

  MEDIA_BUCKET_NAMES.forEach((name) => {
    mediaBuckets[name] = new mongoose.mongo.GridFSBucket(db, { bucketName: name })
  })
}

export const deleteBucketFileById = async (bucketName: MediaBucketName, id: string) => {
  const bucket = resolveRequiredMediaBucket(bucketName)
  const db = mongoose.connection.db

  if (!db) {
    throw new AppError(REQ_STATUS.server, 'Mongo is not connected yet')
  }

  const fileId = new mongoose.Types.ObjectId(id)
  const file = await bucket.find({ _id: fileId }).next()

  if (file) {
    await bucket.delete(fileId)
  }

  await db.collection(`${bucketName}.chunks`).deleteMany({ files_id: fileId })
}
