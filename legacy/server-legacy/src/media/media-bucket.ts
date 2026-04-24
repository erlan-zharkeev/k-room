import { MediaBucketNameType, MongooseGridFSBucketType } from './types'

export const mediaBuckets: Record<MediaBucketNameType, MongooseGridFSBucketType | null> = {
  avatar: null,
  doc: null,
  image: null,
  audio: null,
  video: null
}
