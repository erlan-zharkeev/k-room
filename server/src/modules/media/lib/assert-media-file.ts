import { MB_IN_BYTES, MEDIA_BUCKET_SUPPORTED_KIND_MAP, REQ_STATUS, type MediaBucketName } from 'global-shared'

import { AppError } from 'src/shared/lib/app-error'

import { VALIDATION_MEDIA_OPTIONS_MAP } from '../media.constants'
import { VALIDATE_MEDIA_FILE_I18N } from '../media.i18n'
import type { FileData, UploadOptions } from '../media.types'

export const assertFileMetaData = (fileData: FileData, bucketName: MediaBucketName, options?: UploadOptions) => {
  const { maxMb } = options?.validation ?? VALIDATION_MEDIA_OPTIONS_MAP[bucketName]
  const supportedKindMediaTypes = options?.validation?.supportedKindMediaType
    ? [options.validation.supportedKindMediaType]
    : MEDIA_BUCKET_SUPPORTED_KIND_MAP[bucketName]
  const maxBytes = maxMb * MB_IN_BYTES

  if (fileData.metadata.size > maxBytes) {
    throw new AppError(REQ_STATUS.badRequest, VALIDATE_MEDIA_FILE_I18N.fileIsTooLarge)
  }

  if (!(supportedKindMediaTypes as readonly string[]).includes(fileData.metadata.kind ?? '')) {
    throw new AppError(REQ_STATUS.badRequest, VALIDATE_MEDIA_FILE_I18N.extNotSupported)
  }
}

export const assertRawFileSize = (size: number, bucketName: MediaBucketName, options?: UploadOptions) => {
  const { maxMb } = options?.validation ?? VALIDATION_MEDIA_OPTIONS_MAP[bucketName]
  const maxBytes = maxMb * MB_IN_BYTES

  if (size > maxBytes) {
    throw new AppError(REQ_STATUS.badRequest, VALIDATE_MEDIA_FILE_I18N.fileIsTooLarge)
  }
}
