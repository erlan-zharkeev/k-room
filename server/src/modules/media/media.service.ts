import { Buffer } from 'node:buffer'

import { Injectable } from '@nestjs/common'
import { REQ_STATUS, type MediaBucketName } from 'global-shared'
import mongoose from 'mongoose'

import { AppError, isAppError } from 'src/shared/lib/app-error'
import { localizedText } from 'src/shared/lib/localized-text'

import { assertFileMetaData, assertRawFileSize } from './lib/assert-media-file'
import { buildFileData } from './lib/build-file-data'
import { processImageWithSharp } from './lib/process-image-with-sharp'
import { MEDIA_BUCKET_NAMES } from './media.constants'
import { COMMON_MEDIA_I18N, VALIDATE_MEDIA_FILE_I18N } from './media.i18n'
import type {
  StreamMediaFileOptions,
  UploadOptions,
  UploadedMediaCleanupCallback,
  UploadedMediaCleanupItem,
  MongooseGridFSBucket
} from './media.types'

const mediaBuckets: Record<MediaBucketName, MongooseGridFSBucket | null> = {
  doc: null,
  image: null,
  audio: null,
  video: null
}

const getResponseLanguage = (response: import('express').Response) => response.req.language

const getRequiredBucket = (bucketName: MediaBucketName) => {
  const bucket = mediaBuckets[bucketName]

  if (!bucket) {
    throw new AppError(REQ_STATUS.notFound, COMMON_MEDIA_I18N.failedToFindBucket)
  }

  return bucket
}

export const initMediaBuckets = () => {
  const db = mongoose.connection.db

  if (!db) {
    throw new AppError(REQ_STATUS.server, 'Mongo is not connected yet')
  }

  MEDIA_BUCKET_NAMES.forEach((name) => {
    mediaBuckets[name] = new mongoose.mongo.GridFSBucket(db, { bucketName: name })
  })
}

export const deleteBucketFileById = async (bucketName: MediaBucketName, id: string) => {
  const bucket = getRequiredBucket(bucketName)
  const fileId = new mongoose.Types.ObjectId(id)
  const file = await bucket.find({ _id: fileId }).next()

  if (!file) {
    return
  }

  await bucket.delete(fileId)
}

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
    const bucket = getRequiredBucket(bucketName)
    const normalizedBuffer = buffer instanceof Buffer ? buffer : Buffer.from(new Uint8Array(buffer))
    const fileId = options?.id ? new mongoose.Types.ObjectId(options.id) : new mongoose.Types.ObjectId()
    const filename = String(fileId)

    assertRawFileSize(normalizedBuffer.length, bucketName, options)

    const outputBuffer =
      bucketName === 'image'
        ? await processImageWithSharp(normalizedBuffer, options?.compression ?? 'common-compressed')
        : normalizedBuffer
    const fileData = await buildFileData(outputBuffer, filename)

    assertFileMetaData(fileData, bucketName, options)

    if (options?.overwrite) {
      await deleteBucketFileById(bucketName, filename)
    }

    return new Promise<string>((resolve, reject) => {
      const stream = bucket.openUploadStreamWithId(fileId, fileData.filename, {
        contentType: fileData.contentType,
        metadata: fileData.metadata
      })

      stream.once('finish', () => resolve(filename))
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
  bucketName: MediaBucketName,
  id: string,
  response: import('express').Response,
  options?: StreamMediaFileOptions
) => {
  try {
    const bucket = getRequiredBucket(bucketName)

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(REQ_STATUS.notFound, COMMON_MEDIA_I18N.fileNotFound, true)
    }

    const fileId = new mongoose.Types.ObjectId(id)
    const file = await bucket.find({ _id: fileId }).next()

    if (!file) {
      throw new AppError(REQ_STATUS.notFound, COMMON_MEDIA_I18N.fileNotFound, true)
    }

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
              text: localizedText(COMMON_MEDIA_I18N.fileNotFound, getResponseLanguage(response)),
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
  async getMediaFile(idParam: string, response: import('express').Response, options?: StreamMediaFileOptions) {
    if (!idParam) {
      throw new AppError(REQ_STATUS.notFound, COMMON_MEDIA_I18N.fileNotFound)
    }

    await streamMediaFile('image', idParam, response, options)
  }
}
