import { StatusEnum } from 'common-types'
import { MediaBucketNameType } from 'entities/media'
import { streamMediaFile } from 'entities/media/lib/stream-media-file'
import type { AppResponseType, IAppRequest } from 'shared-config'
import { throwHTTPError } from 'shared-lib'

import { MESSAGE } from './config'
import { parseBucketNameFromId } from './lib'

export const getMediaFile = async (req: IAppRequest, res: AppResponseType<null>) => {
  try {
    const idParam = String(req.params.id || req.query.id || '')

    const revalidateCache = Boolean(req.query.revalidate)

    if (!idParam) {
      return throwHTTPError(StatusEnum.NotFound, res, MESSAGE.idNotProvideOrNotValid)
    }
    const { bucketName, id } = parseBucketNameFromId(idParam)
    const asAttachment = ['1', 'true', 'yes'].includes(String(req.query.download || '').toLowerCase())

    streamMediaFile(bucketName as MediaBucketNameType, id, res, { asAttachment, revalidateCache })
    return
  } catch {
    return throwHTTPError(StatusEnum.Server, res, MESSAGE.failedToProvideMedia)
  }
}
