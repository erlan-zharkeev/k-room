import type { Response } from 'express'

import { type AppLanguageType, StatusEnum } from 'common'

import { COMMON_MEDIA_MESSAGE, MediaBucketNameType, mediaBuckets } from 'src/entities/media'

import { getLocalizedText, throwHTTPError } from 'src/shared/lib'

export const streamMediaFile = async (
  bucketName: MediaBucketNameType,
  id: string,
  res: Response,
  language?: AppLanguageType,
  opts?: { asAttachment?: boolean; revalidateCache?: boolean }
) => {
  try {
    const bucket = mediaBuckets[bucketName]

    if (!bucket) {
      return throwHTTPError(
        StatusEnum.NotFound,
        res,
        getLocalizedText(COMMON_MEDIA_MESSAGE.failedToStreamFile, language)
      )
    }

    const filename = `${bucketName}.${id}`

    const file = await bucket.find({ filename }).next()

    if (!file) {
      return throwHTTPError(
        StatusEnum.NotFound,
        res,
        getLocalizedText(COMMON_MEDIA_MESSAGE.fileNotFound, language),
        true
      )
    }

    res.setHeader('Content-Type', file.contentType || 'application/octet-stream')
    if (file.uploadDate) res.setHeader('Last-Modified', file.uploadDate.toUTCString())
    const etag = `W/"sha256-${file?.metadata?.sha256}"`
    res.setHeader('ETag', etag)
    const maxAge = opts?.revalidateCache ? '0' : '31536000'
    const mutable = opts?.revalidateCache ? 'must-revalidate' : 'immutable'
    res.setHeader('Cache-Control', `public, max-age=${maxAge}, ${mutable}`)
    res.setHeader('X-Media-Kind', file.metadata?.kind || '')
    if (opts?.asAttachment) {
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(file.filename)}"`)
    }

    bucket
      .openDownloadStreamByName(filename)
      .on('error', () =>
        throwHTTPError(StatusEnum.NotFound, res, getLocalizedText(COMMON_MEDIA_MESSAGE.fileNotFound, language))
      )
      .pipe(res)
  } catch {
    return throwHTTPError(
      StatusEnum.Server,
      res ?? null,
      getLocalizedText(COMMON_MEDIA_MESSAGE.failedToStreamFile, language)
    )
  }
}
