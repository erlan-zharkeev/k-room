import { Response } from 'express'

import { AppLanguageType, StatusEnum } from 'common'

import { AppError, isAppError, localizedText, throwHTTPError } from 'src/shared/lib'

import { COMMON_MEDIA_I18N, MediaBucketNameType } from './../config'
import { mediaBuckets } from './../model'

export const streamMediaFile = async (
  bucketName: MediaBucketNameType,
  id: string,
  res: Response,
  language: AppLanguageType,
  opts?: { asAttachment?: boolean; revalidateCache?: boolean }
) => {
  try {
    const bucket = mediaBuckets[bucketName]

    if (!bucket) {
      throw new AppError(StatusEnum.NotFound, localizedText(COMMON_MEDIA_I18N.failedToFindBucket, language))
    }

    const filename = `${bucketName}.${id}`

    const file = await bucket.find({ filename }).next()

    if (!file) {
      throw new AppError(StatusEnum.NotFound, localizedText(COMMON_MEDIA_I18N.fileNotFound, language), true)
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
      .on('error', (error) =>
        throwHTTPError(StatusEnum.NotFound, res, localizedText(COMMON_MEDIA_I18N.fileNotFound, language), false, error)
      )
      .pipe(res)
  } catch (error) {
    if (isAppError(error)) {
      throw error
    }

    throw new AppError(StatusEnum.Server, localizedText(COMMON_MEDIA_I18N.failedToStreamFile, language), false, error)
  }
}
