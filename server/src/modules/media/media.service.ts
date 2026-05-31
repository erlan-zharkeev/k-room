import { Buffer } from 'node:buffer'

import { Injectable } from '@nestjs/common'
import { type Response } from 'express'
import { REQ_STATUS, type MediaBucketName } from 'global-shared'
import mongoose from 'mongoose'

import { AppError, isAppError } from 'src/shared/lib/app-error'
import { localizedText } from 'src/shared/lib/localized-text'

import { assertFileMetaData, assertRawFileSize } from './lib/assert-media-file'
import { buildFileData } from './lib/build-file-data'
import { deleteBucketFileById, findMediaBucketFileById, resolveRequiredMediaBucket } from './lib/media-buckets'
import { processImageWithSharp } from './lib/process-image-with-sharp'
import { STREAM_MEDIA_BUCKET_NAMES } from './media.constants'
import { COMMON_MEDIA_I18N, VALIDATE_MEDIA_FILE_I18N } from './media.i18n'
import type {
  StreamMediaBucketFile,
  StreamMediaFileOptions,
  UploadOptions,
  UploadedMediaCleanupCallback,
  UploadedMediaCleanupItem
} from './media.types'

export { deleteBucketFileById, initMediaBuckets } from './lib/media-buckets'

export const withUploadedMediaCleanup = async <TResult>(
  callback: UploadedMediaCleanupCallback<TResult>
): Promise<TResult> => {
  const uploadedMedia: UploadedMediaCleanupItem[] = []

  try {
    return await callback((bucketName, id) => {
      uploadedMedia.push({ bucketName, id })
    })
  } catch (error) {
    await Promise.allSettled(uploadedMedia.map(({ bucketName, id }) => deleteBucketFileById(bucketName, id)))

    throw error
  }
}

export const uploadBufferToBucket = async (
  buffer: Buffer | ArrayBuffer,
  bucketName: MediaBucketName,
  options?: UploadOptions
) => {
  try {
    const bucket = resolveRequiredMediaBucket(bucketName)
    const normalizedBuffer = buffer instanceof Buffer ? buffer : Buffer.from(new Uint8Array(buffer))
    const fileId = options?.id ? new mongoose.Types.ObjectId(options.id) : new mongoose.Types.ObjectId()
    const fileIdValue = String(fileId)
    const filename = options?.filename ?? fileIdValue

    assertRawFileSize(normalizedBuffer.length, bucketName, options)

    const outputBuffer =
      bucketName === 'image'
        ? await processImageWithSharp(normalizedBuffer, options?.compression ?? 'common-compressed')
        : normalizedBuffer
    const fileData = await buildFileData(outputBuffer, filename, options?.contentType)

    assertFileMetaData(fileData, bucketName, options)

    if (options?.overwrite) {
      await deleteBucketFileById(bucketName, fileIdValue)
    }

    return new Promise<string>((resolve, reject) => {
      const stream = bucket.openUploadStreamWithId(fileId, fileData.filename, {
        contentType: fileData.contentType,
        metadata: fileData.metadata
      })

      stream.once('finish', () => resolve(fileIdValue))
      stream.once('error', reject)
      stream.end(outputBuffer)
    })
  } catch (error) {
    if (isAppError(error)) {
      throw error
    }

    throw new AppError(REQ_STATUS.server, VALIDATE_MEDIA_FILE_I18N.uploadFailed, false, error)
  }
}

export const streamMediaFile = async (
  bucketName: MediaBucketName | readonly MediaBucketName[],
  id: string,
  response: Response,
  options?: StreamMediaFileOptions
) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(REQ_STATUS.notFound, COMMON_MEDIA_I18N.fileNotFound, true)
    }

    const fileId = new mongoose.Types.ObjectId(id)
    const bucketNames = Array.isArray(bucketName) ? bucketName : [bucketName]
    const bucketFile = (await Promise.all(bucketNames.map((name) => findMediaBucketFileById(name, fileId)))).find(
      (item): item is StreamMediaBucketFile => Boolean(item)
    )

    if (!bucketFile) {
      throw new AppError(REQ_STATUS.notFound, COMMON_MEDIA_I18N.fileNotFound, true)
    }

    const { bucket, file } = bucketFile

    response.setHeader('Content-Type', file.contentType ?? 'application/octet-stream')

    if (file.uploadDate) {
      response.setHeader('Last-Modified', file.uploadDate.toUTCString())
    }

    response.setHeader('ETag', `W/"sha256-${file?.metadata?.sha256}"`)
    response.setHeader('Cache-Control', 'no-store')
    response.setHeader('X-Media-Kind', file.metadata?.kind ?? '')

    if (options?.asAttachment) {
      response.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(file.filename)}"`)
    }

    bucket
      .openDownloadStream(fileId)
      .on('error', () => {
        if (!response.headersSent) {
          response.status(REQ_STATUS.notFound).json({
            payload: null,
            message: {
              text: localizedText(COMMON_MEDIA_I18N.fileNotFound, response.req.language),
              silent: false
            }
          })
        }
      })
      .pipe(response)
  } catch (error) {
    if (isAppError(error)) {
      throw error
    }

    throw new AppError(REQ_STATUS.server, COMMON_MEDIA_I18N.failedToStreamFile, false, error)
  }
}

@Injectable()
export class MediaService {
  async getMediaFile(idParam: string, response: Response, options?: StreamMediaFileOptions) {
    if (!idParam) {
      throw new AppError(REQ_STATUS.notFound, COMMON_MEDIA_I18N.fileNotFound)
    }

    await streamMediaFile(STREAM_MEDIA_BUCKET_NAMES, idParam, response, options)
  }
}
