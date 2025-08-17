import { StatusEnum } from 'common-types'
import type { Response } from 'express'
import { throwHTTPError } from 'shared-lib'

import { COMMON_MEDIA_MESSAGE, MediaBucketNameType } from '../config'
import { mediaBuckets } from '../model/media-bucket'

export const streamGridFSFile = async (bucketName: MediaBucketNameType, id: string, res: Response) => {
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

    bucket
      .openDownloadStreamByName(filename)
      .on('error', () => throwHTTPError(StatusEnum.NotFound, res, COMMON_MEDIA_MESSAGE.fileNotFound))
      .pipe(res)
  } catch (e: unknown) {
    console.log(e, 'eee')
    throwHTTPError(StatusEnum.Server, res ?? null, COMMON_MEDIA_MESSAGE.failedToStreamFile)
  }
}
