import { AppLanguageType, REQ_STATUS } from 'common'

import { AppError } from 'src/shared/lib/app-error'
import { localizedText } from 'src/shared/lib/localized-text'

import { VALIDATION_MEDIA_OPTIONS_MAP } from '../config/constants'
import { VALIDATE_MEDIA_FILE_I18N } from '../config/i18n'
import { IFileData, MediaBucketNameType } from '../types'

export const validateFileMetaData = (
  filedata: IFileData,
  bucketName: MediaBucketNameType,
  language: AppLanguageType
) => {
  const { maxMb, supportedKindMediaType } = VALIDATION_MEDIA_OPTIONS_MAP[bucketName]

  const maxBytes = maxMb * 1024 * 1024
  if (filedata.metadata.size > maxBytes) {
    throw new AppError(REQ_STATUS.badRequest, localizedText(VALIDATE_MEDIA_FILE_I18N.fileIsTooLarge, language))
  }

  if (filedata.metadata.kind !== supportedKindMediaType) {
    throw new AppError(REQ_STATUS.badRequest, localizedText(VALIDATE_MEDIA_FILE_I18N.extNotSupported, language))
  }

  return true
}
