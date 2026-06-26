import { type NextFunction, type Request, type Response, type Router } from 'express'
import { REQ_STATUS, type MediaBucketName } from 'global-shared'

import { isAppError } from 'src/shared/lib/app-error'

import { ADMIN_MEDIA_PREVIEW_ROUTE, STREAM_MEDIA_BUCKET_NAMES } from './media.constants'
import { streamMediaFile } from './media.service'

const isMediaBucketName = (value: string): value is MediaBucketName =>
  STREAM_MEDIA_BUCKET_NAMES.includes(value as MediaBucketName)

const isDownloadRequest = (value: unknown) => ['1', 'true', 'yes'].includes(String(value ?? '').toLowerCase())

const streamAdminMediaPreview = async (request: Request, response: Response, next: NextFunction) => {
  const { bucketName, id } = request.params

  if (!bucketName || !isMediaBucketName(bucketName) || !id) {
    response.sendStatus(REQ_STATUS.notFound)
    return
  }

  try {
    await streamMediaFile(bucketName, id, response, {
      asAttachment: isDownloadRequest(request.query.download)
    })
  } catch (error) {
    if (response.headersSent) {
      next(error)
      return
    }

    response.sendStatus(isAppError(error) ? error.status : REQ_STATUS.server)
  }
}

export const attachAdminMediaPreviewRoute = (router: Router) => {
  router.get(ADMIN_MEDIA_PREVIEW_ROUTE, (request, response, next) => {
    void streamAdminMediaPreview(request, response, next)
  })
}
