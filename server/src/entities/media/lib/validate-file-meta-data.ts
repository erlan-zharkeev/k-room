import { AppLanguageType, StatusEnum } from 'common'

import { AppError, getLocalizedText } from 'src/shared/lib'

import {
  IFileData,
  MediaBucketNameType,
  VALIDATE_MEDIA_FILE_I18N,
  VALIDATION_MEDIA_OPTIONS_MAP
} from './../config'

export const validateFileMetaData = (
  filedata: IFileData,
  bucketName: MediaBucketNameType,
  language?: AppLanguageType
) => {
  const { maxMb, supportedKindMediaType } = VALIDATION_MEDIA_OPTIONS_MAP[bucketName]

  const maxBytes = maxMb * 1024 * 1024
  if (filedata.metadata.size > maxBytes) {
    throw new AppError(StatusEnum.BadRequest, getLocalizedText(VALIDATE_MEDIA_FILE_I18N.fileIsTooLarge, language))
  }

  if (filedata.metadata.kind !== supportedKindMediaType) {
    throw new AppError(StatusEnum.BadRequest, getLocalizedText(VALIDATE_MEDIA_FILE_I18N.extNotSupported, language))
  }

  return true
}
