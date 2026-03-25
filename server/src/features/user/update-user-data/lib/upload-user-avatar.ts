import type { Response } from 'express'

import { type AppLanguageType } from 'common-types'

import { MongooseGridFSBucketType, uploadBufferToBucket } from 'entities/media'
import { mediaBuckets } from 'entities/media'

export const updateUserAvatar = async (buffer: Buffer | null, userId: string, res?: Response, language?: AppLanguageType) => {
  const bucket = mediaBuckets.avatar as MongooseGridFSBucketType
  const filename = `avatar.${String(userId)}`

  if (buffer === null) {
    const existing = await bucket.find({ filename }).toArray()
    if (existing.length <= 0) return
    await Promise.all(existing.map((f) => bucket.delete(f._id)))
    return
  }

  await uploadBufferToBucket(bucket, buffer, filename, 'avatar', res, {
    overwrite: true,
    compression: 'avatar'
  }, language)
}
