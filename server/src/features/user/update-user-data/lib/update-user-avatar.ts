import { AppLanguageType, DEFAULT_APP_LANGUAGE } from 'common'

import { mediaBuckets, MongooseGridFSBucketType, uploadBufferToBucket } from 'src/entities/media'

export const updateUserAvatar = async (
  buffer: Buffer | null,
  userId: string,
  language: AppLanguageType = DEFAULT_APP_LANGUAGE
) => {
  const bucket = mediaBuckets.avatar as MongooseGridFSBucketType
  const filename = `avatar.${String(userId)}`

  if (buffer === null) {
    const existing = await bucket.find({ filename }).toArray()
    if (existing.length <= 0) return
    await Promise.all(existing.map((f) => bucket.delete(f._id)))
    return
  }

  await uploadBufferToBucket(
    bucket,
    buffer,
    filename,
    'avatar',
    language,
    {
      overwrite: true,
      compression: 'avatar'
    }
  )
}
