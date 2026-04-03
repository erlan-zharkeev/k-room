import { StatusEnum } from 'common'

import { MediaBucketNameType } from 'src/entities/media'
import { streamMediaFile } from 'src/entities/media'

import { AppResponseType, IAppRequest } from 'src/shared/config'
import { getLocalizedText, isAppError, throwHTTPError } from 'src/shared/lib'

import { GET_MEDIA_FILE_I18N } from './config'
import { parseBucketNameFromId } from './lib'

export const getMediaFileController = async (req: IAppRequest, res: AppResponseType<null>) => {
  const { language } = req
  const basicError = getLocalizedText(GET_MEDIA_FILE_I18N.failedToProvideMedia, language)

  try {
    const idParam = String(req.params.id || req.query.id || '')

    const revalidateCache = Boolean(req.query.revalidate)

    if (!idParam) {
      return throwHTTPError(
        StatusEnum.NotFound,
        res,
        getLocalizedText(GET_MEDIA_FILE_I18N.idNotProvideOrNotValid, language)
      )
    }
    const { bucketName, id } = parseBucketNameFromId(idParam)
    const asAttachment = ['1', 'true', 'yes'].includes(String(req.query.download || '').toLowerCase())

    await streamMediaFile(bucketName as MediaBucketNameType, id, res, language, { asAttachment, revalidateCache })
    return
  } catch (error) {
    if (isAppError(error)) {
      return throwHTTPError(error.status, res, error.message, error.silent)
    }

    return throwHTTPError(StatusEnum.Server, res, basicError, false, error)
  }
}
