import { Buffer } from 'node:buffer'

import type { Response } from 'express'

import { type AppLanguageType, StatusEnum } from 'common'

import { VALIDATE_MEDIA_FILE_MESSAGE } from 'src/entities/media'
import type { IUploadOptions, MediaBucketNameType, MongooseGridFSBucketType } from 'src/entities/media/config'
import { buildFileData } from 'src/entities/media/lib'
import { processImageWithSharp } from 'src/entities/media/lib'
import { validateFileMetaData } from 'src/entities/media/lib'

import { getLocalizedText, throwHTTPError } from 'src/shared/lib'

export const uploadBufferToBucket = async (
  bucket: MongooseGridFSBucketType,
  buffer: Buffer | ArrayBuffer,
  filename: string,
  bucketName: MediaBucketNameType,
  res?: Response,
  options?: IUploadOptions,
  language?: AppLanguageType
) => {
  try {
    const normalizedBuffer = buffer instanceof Buffer ? buffer : Buffer.from(new Uint8Array(buffer))
    const outBuffer = await processImageWithSharp(normalizedBuffer, options?.compression ?? 'common-compressed')

    const fileData = await buildFileData(outBuffer, filename)

    validateFileMetaData(fileData, bucketName, res, language)

    const overwrite = options?.overwrite ?? false

    const existing = await bucket.find({ filename: fileData.filename }).toArray()

    if (existing.length > 0) {
      if (!overwrite) {
        return throwHTTPError(
          StatusEnum.Server,
          res ?? null,
          getLocalizedText(VALIDATE_MEDIA_FILE_MESSAGE.fileWithThisNameAlreadyExists, language)
        )
      }
      await Promise.all(existing.map((f) => bucket.delete(f._id)))
    }

    return new Promise((resolve, reject) => {
      const stream = bucket.openUploadStream(filename, {
        contentType: fileData.contentType,
        metadata: fileData.metadata
      })
      stream.once('finish', () => resolve(stream.id))
      stream.once('error', reject)
      stream.end(outBuffer)
    })
  } catch {
    throwHTTPError(StatusEnum.Server, res ?? null, getLocalizedText(VALIDATE_MEDIA_FILE_MESSAGE.uploadFailed, language))
  }
}
