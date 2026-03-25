import { type Response } from 'express'

import { type AppLanguageType, StatusEnum } from 'common-types'

import { getLocalizedText, throwHTTPError } from 'shared-lib'

import {
  type IFileData,
  type MediaBucketNameType,
  VALIDATE_MEDIA_FILE_MESSAGE,
  validationMediaOptionsMap
} from '../config'

export const validateFileMetaData = (
  filedata: IFileData,
  bucketName: MediaBucketNameType,
  res: Response | null = null,
  language?: AppLanguageType
) => {
  const { maxMb, supportedKindMediaType } = validationMediaOptionsMap[bucketName]

  const maxBytes = maxMb * 1024 * 1024
  if (filedata.metadata.size > maxBytes) {
    throwHTTPError(StatusEnum.BadRequest, res, getLocalizedText(VALIDATE_MEDIA_FILE_MESSAGE.fileIsTooLarge, language))
  }

  if (filedata.metadata.kind !== supportedKindMediaType) {
    throwHTTPError(StatusEnum.BadRequest, res, getLocalizedText(VALIDATE_MEDIA_FILE_MESSAGE.extNotSupported, language))
  }
  return true
}
