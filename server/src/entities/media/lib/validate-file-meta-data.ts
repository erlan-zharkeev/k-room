import { type Response } from 'express'

import { StatusEnum } from 'common-types'

import { throwHTTPError } from 'shared-lib'

import {
  type IFileData,
  type MediaBucketNameType,
  VALIDATE_MEDIA_FILE_MESSAGE,
  validationMediaOptionsMap
} from '../config'

export const validateFileMetaData = (
  filedata: IFileData,
  bucketName: MediaBucketNameType,
  res: Response | null = null
) => {
  const { maxMb, supportedKindMediaType } = validationMediaOptionsMap[bucketName]

  const maxBytes = maxMb * 1024 * 1024
  if (filedata.metadata.size > maxBytes) {
    throwHTTPError(StatusEnum.BadRequest, res, VALIDATE_MEDIA_FILE_MESSAGE.fileIsTooLarge)
  }

  if (filedata.metadata.kind !== supportedKindMediaType) {
    throwHTTPError(StatusEnum.BadRequest, res, VALIDATE_MEDIA_FILE_MESSAGE.extNotSupported)
  }
  return true
}
