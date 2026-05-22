import { MediaBucketName, MongooseGridFSBucket } from './types'

export const mediaBuckets: Record<MediaBucketName, MongooseGridFSBucket | null> = {
  avatar: null,
  doc: null,
  image: null,
  audio: null,
  video: null
}
