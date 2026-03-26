import { MediaBucketNameType, MongooseGridFSBucketType } from 'entities/media/config'

export const mediaBuckets: Record<MediaBucketNameType, MongooseGridFSBucketType | null> = {
  avatar: null,
  doc: null,
  image: null,
  audio: null,
  video: null
}
