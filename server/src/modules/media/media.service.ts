import { Buffer } from 'node:buffer'
import { createHash } from 'node:crypto'

import { Injectable } from '@nestjs/common'
import fileTypeDep from 'file-type'
import { MB_IN_BYTES, REQ_STATUS, type MediaBucketName } from 'global-shared'
import imageSize from 'image-size'
import { lookup as mimeLookup } from 'mime-types'
import mongoose from 'mongoose'
import sharp from 'sharp'

import { AppError, isAppError } from 'src/shared/lib/app-error'
import { localizedText } from 'src/shared/lib/localized-text'

import { MEDIA_BUCKET_NAMES, SHARP_PRESETS, VALIDATION_MEDIA_OPTIONS_MAP } from './media.constants'
import { COMMON_MEDIA_I18N, VALIDATE_MEDIA_FILE_I18N } from './media.i18n'
import type {
  FileData,
  FileMetaData,
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

const createSha256FromBuffer = (buffer: Buffer) => {
  return createHash('sha256').update(buffer).digest('hex')
}

const buildFileData = async (buffer: Buffer, filename: string): Promise<FileData> => {
  const fileType = await fileTypeDep.fromBuffer(buffer).catch(() => null)
  const contentType = fileType?.mime ?? (filename ? mimeLookup(filename) || undefined : undefined)
  const metadata: FileMetaData = {
    size: buffer.length,
    sha256: createSha256FromBuffer(buffer),
    detectedMime: fileType?.mime,
    detectedExt: fileType?.ext,
    kind: contentType?.split('/')[0]
  }

  if (contentType?.startsWith('image/')) {
    const size = imageSize(buffer)

    if (size.width && size.height) {
      metadata.width = size.width
      metadata.height = size.height
      metadata.orientation = size.width >= size.height ? 'landscape' : 'portrait'
    }
  }

  return {
    filename,
    contentType,
    metadata
  }
}

const processImageWithSharp = async (input: Buffer, presetKey: UploadOptions['compression']) => {
  const preset = SHARP_PRESETS[presetKey ?? 'common-compressed']

  return sharp(input, { failOn: 'none' })
    .rotate()
    .resize({
      width: preset.dimensions.width ?? undefined,
      height: preset.dimensions.height ?? undefined,
      withoutEnlargement: true,
      fastShrinkOnLoad: true
    })
    .toFormat('webp', { quality: preset.quality })
    .toBuffer()
}

const getResponseLanguage = (response: import('express').Response) => response.req.language

const getRequiredBucket = (bucketName: MediaBucketName) => {
  const bucket = mediaBuckets[bucketName]

  if (!bucket) {
    throw new AppError(REQ_STATUS.notFound, COMMON_MEDIA_I18N.failedToFindBucket)
  }

  return bucket
}

const validateFileMetaData = (fileData: FileData, bucketName: MediaBucketName, options?: UploadOptions) => {
  const { maxMb, supportedKindMediaType } = options?.validation ?? VALIDATION_MEDIA_OPTIONS_MAP[bucketName]
  const maxBytes = maxMb * MB_IN_BYTES

  if (fileData.metadata.size > maxBytes) {
    throw new AppError(REQ_STATUS.badRequest, VALIDATE_MEDIA_FILE_I18N.fileIsTooLarge)
  }

  if (fileData.metadata.kind !== supportedKindMediaType) {
    throw new AppError(REQ_STATUS.badRequest, VALIDATE_MEDIA_FILE_I18N.extNotSupported)
  }
}

const validateRawFileSize = (size: number, bucketName: MediaBucketName, options?: UploadOptions) => {
  const { maxMb } = options?.validation ?? VALIDATION_MEDIA_OPTIONS_MAP[bucketName]
  const maxBytes = maxMb * MB_IN_BYTES

  if (size > maxBytes) {
    throw new AppError(REQ_STATUS.badRequest, VALIDATE_MEDIA_FILE_I18N.fileIsTooLarge)
  }
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

    validateRawFileSize(normalizedBuffer.length, bucketName, options)

    const outputBuffer =
      bucketName === 'image'
        ? await processImageWithSharp(normalizedBuffer, options?.compression ?? 'common-compressed')
        : normalizedBuffer
    const fileData = await buildFileData(outputBuffer, filename)

    validateFileMetaData(fileData, bucketName, options)

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
