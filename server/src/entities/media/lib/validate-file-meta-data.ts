import {
  type IFileData,
  type MediaBucketNameType,
  VALIDATE_MEDIA_FILE_MESSAGE,
  validationMediaOptionsMap
} from '../config'

export const validateFileMetaData = (filedata: IFileData, bucketName: MediaBucketNameType) => {
  const { maxMb, supportedKindMediaType } = validationMediaOptionsMap[bucketName]

  const maxBytes = maxMb * 1024 * 1024
  if (filedata.metadata.size > maxBytes) {
    throw new Error(VALIDATE_MEDIA_FILE_MESSAGE.fileIsTooLarge)
  }

  if (filedata.metadata.kind !== supportedKindMediaType) {
    throw new Error(VALIDATE_MEDIA_FILE_MESSAGE.extNotSupported)
  }
  return true
}
