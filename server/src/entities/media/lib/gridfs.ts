import mongoose from 'mongoose'

import { MediaBucketName } from '../config'

export const getBucket = (bucketName: MediaBucketName) => {
  return new mongoose.mongo.GridFSBucket(mongoose.connection.db!, { bucketName })
}
