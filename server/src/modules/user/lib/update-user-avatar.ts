import { MEDIA_AVATAR_VALIDATION_OPTIONS, type MediaId } from 'global-shared'

import { deleteBucketFileById, uploadBufferToBucket } from '../../media/media.service'

export function updateUserAvatar(buffer: Buffer, currentAvatarId: MediaId): Promise<string>
export function updateUserAvatar(buffer: null, currentAvatarId: MediaId): Promise<null>
export async function updateUserAvatar(buffer: Buffer | null, currentAvatarId: MediaId) {
  if (buffer === null) {
    if (currentAvatarId) {
      await deleteBucketFileById('image', currentAvatarId)
    }

    return null
  }

  return uploadBufferToBucket(buffer, 'image', {
    compression: 'avatar',
    validation: MEDIA_AVATAR_VALIDATION_OPTIONS
  })
}
