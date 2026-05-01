import { Buffer } from 'node:buffer'
import { createHash } from 'node:crypto'

import { Injectable } from '@nestjs/common'
import fileTypeDep from 'file-type'
import { type AppLanguageType, DEFAULT_APP_LANGUAGE, REQ_STATUS } from 'global-shared'
import imageSize from 'image-size'
import { lookup as mimeLookup } from 'mime-types'
import mongoose from 'mongoose'
import sharp from 'sharp'

import { AppError, isAppError } from 'src/shared/lib/app-error'
import { localizedText } from 'src/shared/lib/localized-text'

import { MEDIA_BUCKET_NAMES, SHARP_PRESETS, VALIDATION_MEDIA_OPTIONS_MAP } from './media.constants'
import { COMMON_MEDIA_I18N, VALIDATE_MEDIA_FILE_I18N } from './media.i18n'
import type {
  IFileData,
  IFileMetaData,
  IUploadOptions,
  MediaBucketNameType,
  MongooseGridFSBucketType
} from './media.types'

const mediaBuckets: Record<MediaBucketNameType, MongooseGridFSBucketType | null> = {
  avatar: null,
  doc: null,
  image: null,
  audio: null,
  video: null
}

const createSha256FromBuffer = (buffer: Buffer) => {
  return createHash('sha256').update(buffer).digest('hex')
}

const buildFileData = async (buffer: Buffer, filename: string): Promise<IFileData> => {
  const fileType = await fileTypeDep.fromBuffer(buffer).catch(() => null)
  const contentType = fileType?.mime ?? (filename ? mimeLookup(filename) || undefined : undefined)
  const metadata: IFileMetaData = {
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

const processImageWithSharp = async (input: Buffer, presetKey: IUploadOptions['compression']) => {
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

const getRequiredBucket = (bucketName: MediaBucketNameType, language: AppLanguageType = DEFAULT_APP_LANGUAGE) => {
  const bucket = mediaBuckets[bucketName]

  if (!bucket) {
    throw new AppError(REQ_STATUS.notFound, localizedText(COMMON_MEDIA_I18N.failedToFindBucket, language))
  }

  return bucket
}

const validateFileMetaData = (fileData: IFileData, bucketName: MediaBucketNameType, language: AppLanguageType) => {
  const { maxMb, supportedKindMediaType } = VALIDATION_MEDIA_OPTIONS_MAP[bucketName]
  const maxBytes = maxMb * 1024 * 1024

  if (fileData.metadata.size > maxBytes) {
    throw new AppError(REQ_STATUS.badRequest, localizedText(VALIDATE_MEDIA_FILE_I18N.fileIsTooLarge, language))
  }

  if (fileData.metadata.kind !== supportedKindMediaType) {
    throw new AppError(REQ_STATUS.badRequest, localizedText(VALIDATE_MEDIA_FILE_I18N.extNotSupported, language))
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

export const deleteBucketFilesByName = async (
  bucketName: MediaBucketNameType,
  filename: string,
  language: AppLanguageType = DEFAULT_APP_LANGUAGE
) => {
  const bucket = getRequiredBucket(bucketName, language)
  const existing = await bucket.find({ filename }).toArray()

  if (!existing.length) {
    return
  }

  await Promise.all(existing.map((file) => bucket.delete(file._id)))
}

export const uploadBufferToBucket = async (
  buffer: Buffer | ArrayBuffer,
  filename: string,
  bucketName: MediaBucketNameType,
  language: AppLanguageType,
  options?: IUploadOptions
) => {
  try {
    const bucket = getRequiredBucket(bucketName, language)
    const normalizedBuffer = buffer instanceof Buffer ? buffer : Buffer.from(new Uint8Array(buffer))
    const outputBuffer =
      bucketName === 'avatar' || bucketName === 'image'
        ? await processImageWithSharp(normalizedBuffer, options?.compression ?? 'common-compressed')
        : normalizedBuffer
    const fileData = await buildFileData(outputBuffer, filename)

    validateFileMetaData(fileData, bucketName, language)

    if (options?.overwrite) {
      await deleteBucketFilesByName(bucketName, fileData.filename, language)
    } else {
      const existing = await bucket.find({ filename: fileData.filename }).toArray()

      if (existing.length) {
        throw new AppError(
          REQ_STATUS.server,
          localizedText(VALIDATE_MEDIA_FILE_I18N.fileWithThisNameAlreadyExists, language)
        )
      }
    }

    return new Promise((resolve, reject) => {
      const stream = bucket.openUploadStream(fileData.filename, {
        contentType: fileData.contentType,
        metadata: fileData.metadata
      })

      stream.once('finish', () => resolve(stream.id))
      stream.once('error', reject)
      stream.end(outputBuffer)
    })
  } catch (error) {
    if (isAppError(error)) {
      throw error
    }

    throw new AppError(REQ_STATUS.server, localizedText(VALIDATE_MEDIA_FILE_I18N.uploadFailed, language), false, error)
  }
}

export const streamMediaFile = async (
  bucketName: MediaBucketNameType,
  id: string,
  response: import('express').Response,
  language: AppLanguageType,
  options?: { asAttachment?: boolean; revalidateCache?: boolean }
) => {
  try {
    const bucket = getRequiredBucket(bucketName, language)
    const filename = `${bucketName}.${id}`
    const file = await bucket.find({ filename }).next()

    if (!file) {
      throw new AppError(REQ_STATUS.notFound, localizedText(COMMON_MEDIA_I18N.fileNotFound, language), true)
    }

    response.setHeader('Content-Type', file.contentType ?? 'application/octet-stream')

    if (file.uploadDate) {
      response.setHeader('Last-Modified', file.uploadDate.toUTCString())
    }

    response.setHeader('ETag', `W/"sha256-${file?.metadata?.sha256}"`)
    response.setHeader(
      'Cache-Control',
      options?.revalidateCache ? 'public, max-age=0, must-revalidate' : 'public, max-age=31536000, immutable'
    )
    response.setHeader('X-Media-Kind', file.metadata?.kind ?? '')

    if (options?.asAttachment) {
      response.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(file.filename)}"`)
    }

    bucket
      .openDownloadStreamByName(filename)
      .on('error', () => {
        if (!response.headersSent) {
          response.status(REQ_STATUS.notFound).json({
            payload: null,
            message: {
              text: localizedText(COMMON_MEDIA_I18N.fileNotFound, language),
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

    throw new AppError(REQ_STATUS.server, localizedText(COMMON_MEDIA_I18N.failedToStreamFile, language), false, error)
  }
}

@Injectable()
export class MediaService {
  async getMediaFile(
    idParam: string,
    language: AppLanguageType,
    response: import('express').Response,
    options?: {
      asAttachment?: boolean
      revalidateCache?: boolean
    }
  ) {
    const [bucketName, id] = idParam.split('.', 2)

    if (!bucketName || !id) {
      throw new AppError(REQ_STATUS.notFound, localizedText(COMMON_MEDIA_I18N.fileNotFound, language))
    }

    await streamMediaFile(bucketName as MediaBucketNameType, id, response, language, options)
  }
}
