import { MediaBucketNameType, MongooseGridFSBucketType } from '../config'

export const mediaBuckets: Record<MediaBucketNameType, MongooseGridFSBucketType | null> = {
  avatar: null,
  doc: null,
  image: null,
  audio: null,
  video: null
}
