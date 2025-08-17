import { MongooseGridFSBucketType, uploadBufferToBucket } from 'entities/media'
import { mediaBuckets } from 'entities/media'
import type { Response } from 'express'

export const updateUserAvatar = async (buffer: Buffer, userId: string, res?: Response) => {
  await uploadBufferToBucket(
    mediaBuckets.avatar as MongooseGridFSBucketType,
    buffer,
    `avatar.${String(userId)}`,
    'avatar',
    res,
    {
      overwrite: true
    }
  )
}
