import { type Response } from 'express'

import { type AppLanguageType, StatusEnum } from 'common'

import { getLocalizedText, throwHTTPError } from 'src/shared/lib'

import {
  VALIDATE_MEDIA_FILE_I18N,
  type IFileData,
  type MediaBucketNameType,
  VALIDATION_MEDIA_OPTIONS_MAP
} from './../config'

export const validateFileMetaData = (
  filedata: IFileData,
  bucketName: MediaBucketNameType,
  res: Response | null = null,
  language?: AppLanguageType
) => {
  const { maxMb, supportedKindMediaType } = VALIDATION_MEDIA_OPTIONS_MAP[bucketName]

  const maxBytes = maxMb * 1024 * 1024
  if (filedata.metadata.size > maxBytes) {
    throwHTTPError(
      StatusEnum.BadRequest,
      res,
      getLocalizedText(VALIDATE_MEDIA_FILE_I18N.fileIsTooLarge, language)
    )
  }

  if (filedata.metadata.kind !== supportedKindMediaType) {
    throwHTTPError(
      StatusEnum.BadRequest,
      res,
      getLocalizedText(VALIDATE_MEDIA_FILE_I18N.extNotSupported, language)
    )
  }
  return true
}
