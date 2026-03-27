import type { AppResponseType, IAppRequest } from 'shared-config'

import { StatusEnum } from 'common'

import { MESSAGE } from 'features/media/get-media-file'
import { parseBucketNameFromId } from 'features/media/get-media-file'

import { MediaBucketNameType } from 'entities/media'
import { streamMediaFile } from 'entities/media'

import { getLocalizedText, throwHTTPError } from 'shared-lib'

export const getMediaFile = async (req: IAppRequest, res: AppResponseType<null>) => {
  const language = req.language

  try {
    const idParam = String(req.params.id || req.query.id || '')

    const revalidateCache = Boolean(req.query.revalidate)

    if (!idParam) {
      return throwHTTPError(StatusEnum.NotFound, res, getLocalizedText(MESSAGE.idNotProvideOrNotValid, language))
    }
    const { bucketName, id } = parseBucketNameFromId(idParam)
    const asAttachment = ['1', 'true', 'yes'].includes(String(req.query.download || '').toLowerCase())

    streamMediaFile(bucketName as MediaBucketNameType, id, res, language, { asAttachment, revalidateCache })
    return
  } catch {
    return throwHTTPError(StatusEnum.Server, res, getLocalizedText(MESSAGE.failedToProvideMedia, language))
  }
}
