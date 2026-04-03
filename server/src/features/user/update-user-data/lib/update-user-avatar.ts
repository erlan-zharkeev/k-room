import { AppLanguageType } from 'common'

import { MongooseGridFSBucketType, uploadBufferToBucket } from 'src/entities/media'
import { mediaBuckets } from 'src/entities/media'

export const updateUserAvatar = async (
  buffer: Buffer | null,
  userId: string,
  language?: AppLanguageType
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
    {
      overwrite: true,
      compression: 'avatar'
    },
    language
  )
}
