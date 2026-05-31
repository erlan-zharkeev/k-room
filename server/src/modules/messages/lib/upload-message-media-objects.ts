import type { MediaBucketName, MediaObject } from 'global-shared'

import { uploadBufferToBucket } from '../../media/media.service'
import type { UploadOptions } from '../../media/media.types'

export const uploadMessageMediaObjects = async <Media extends MediaObject>(
  mediaObjects: readonly Media[],
  bucketName: MediaBucketName,
  options?: UploadOptions
): Promise<Media[]> => {
  const uploadedMediaObjects: Array<Media | null> = await Promise.all(
    mediaObjects.map(async (mediaObject): Promise<Media | null> => {
      if (!mediaObject.fileBuffer) {
        return null
      }

      const fileObject = mediaObject as MediaObject & { contentType?: string }
      const src = await uploadBufferToBucket(mediaObject.fileBuffer, bucketName, {
        ...options,
        contentType: fileObject.contentType,
        filename: mediaObject.name
      })
      const uploadedMediaObject: Media = {
        ...mediaObject,
        src,
        name: mediaObject.name || src
      }

      delete uploadedMediaObject.fileBuffer

      return uploadedMediaObject
    })
  )

  return uploadedMediaObjects.filter((mediaObject): mediaObject is Media => Boolean(mediaObject))
}
