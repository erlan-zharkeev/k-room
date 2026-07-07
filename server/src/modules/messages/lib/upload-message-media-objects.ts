import type { MediaBucketName, MediaObject } from 'global-shared'

import { buildImageAspectRatioDetails } from '../../media/lib/build-image-aspect-ratio-details'
import { uploadBufferToBucketWithFileData } from '../../media/media.service'
import type { UploadOptions } from '../../media/media.types'
import type { MessageMediaFileObject } from '../messages.types'

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

      const fileObject = mediaObject as MessageMediaFileObject
      const { fileData, id } = await uploadBufferToBucketWithFileData(mediaObject.fileBuffer, bucketName, {
        ...options,
        contentType: fileObject.contentType,
        filename: mediaObject.name
      })
      const aspectRatioDetails =
        bucketName === 'image' || bucketName === 'video' ? buildImageAspectRatioDetails(fileData.metadata) : {}
      const uploadedMediaObject: Media = {
        ...mediaObject,
        src: id,
        name: mediaObject.name || id,
        ...aspectRatioDetails
      }

      delete uploadedMediaObject.fileBuffer

      return uploadedMediaObject
    })
  )

  return uploadedMediaObjects.filter((mediaObject): mediaObject is Media => Boolean(mediaObject))
}
