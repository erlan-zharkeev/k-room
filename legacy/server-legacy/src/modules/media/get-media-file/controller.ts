import { REQ_STATUS } from 'common'

import { MediaBucketName } from 'src/media'
import { streamMediaFile } from 'src/media'

import { AppResponse, AppRequest } from 'src/shared/config'
import { isAppError } from 'src/shared/lib/app-error'
import { localizedText } from 'src/shared/lib/localized-text'
import { throwHTTPError } from 'src/shared/lib/throw-error'

import { GET_MEDIA_FILE_I18N } from './i18n'
import { parseBucketNameFromId } from './lib/parse-bucket-name-from-id'

export const getMediaFileController = async (req: AppRequest, res: AppResponse<null>) => {
  const { language } = req
  const basicError = localizedText(GET_MEDIA_FILE_I18N.failedToProvideMedia, language)

  try {
    const idParam = String(req.params.id || req.query.id || '')

    const revalidateCache = Boolean(req.query.revalidate)

    if (!idParam) {
      return throwHTTPError(
        REQ_STATUS.notFound,
        res,
        localizedText(GET_MEDIA_FILE_I18N.idNotProvideOrNotValid, language)
      )
    }
    const { bucketName, id } = parseBucketNameFromId(idParam)
    const asAttachment = ['1', 'true', 'yes'].includes(String(req.query.download || '').toLowerCase())

    await streamMediaFile(bucketName as MediaBucketName, id, res, language, { asAttachment, revalidateCache })
    return
  } catch (error) {
    if (isAppError(error)) {
      return throwHTTPError(error.status, res, error.message, error.silent)
    }

    return throwHTTPError(REQ_STATUS.server, res, basicError, false, error)
  }
}
