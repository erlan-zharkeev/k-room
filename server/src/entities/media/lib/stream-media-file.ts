import { StatusEnum } from 'common-types'
import type { Response } from 'express'
import { throwHTTPError } from 'shared-lib'

import { COMMON_MEDIA_MESSAGE, MediaBucketNameType } from '../config'
import { mediaBuckets } from '../model/media-bucket'

export const streamMediaFile = async (
  bucketName: MediaBucketNameType,
  id: string,
  res: Response,
  opts?: { asAttachment?: boolean }
) => {
  try {
    const bucket = mediaBuckets[bucketName]

    if (!bucket) {
      return throwHTTPError(StatusEnum.NotFound, res, COMMON_MEDIA_MESSAGE.failedToStreamFile)
    }

    const filename = `${bucketName}.${id}`

    const file = await bucket.find({ filename }).next()

    if (!file) {
      return throwHTTPError(StatusEnum.NotFound, res, COMMON_MEDIA_MESSAGE.fileNotFound)
    }

    res.setHeader('Content-Type', file.contentType || 'application/octet-stream')
    if (file.uploadDate) res.setHeader('Last-Modified', file.uploadDate.toUTCString())
    const etag = `W/"sha256-${file?.metadata?.sha256}"`
    res.setHeader('ETag', etag)
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    res.setHeader('X-Media-Kind', file.metadata?.kind || '')
    if (opts?.asAttachment) {
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(file.filename)}"`)
    }

    bucket
      .openDownloadStreamByName(filename)
      .on('error', () => throwHTTPError(StatusEnum.NotFound, res, COMMON_MEDIA_MESSAGE.fileNotFound))
      .pipe(res)
  } catch {
    return throwHTTPError(StatusEnum.Server, res ?? null, COMMON_MEDIA_MESSAGE.failedToStreamFile)
  }
}
