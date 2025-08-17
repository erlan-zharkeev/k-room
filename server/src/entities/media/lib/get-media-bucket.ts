import mongoose from 'mongoose'

import { MediaBucketNameType } from '../config'

export const getMediaBucket = (bucketName: MediaBucketNameType) => {
  return new mongoose.mongo.GridFSBucket(mongoose.connection.db!, { bucketName })
}
