import { Buffer } from 'node:buffer'

import { AppLanguageType, StatusEnum } from 'common'

import { AppError, isAppError, localizedText } from 'src/shared/lib'

import { IUploadOptions, MediaBucketNameType, MongooseGridFSBucketType, VALIDATE_MEDIA_FILE_I18N } from './../config'

import { buildFileData, processImageWithSharp, validateFileMetaData } from './index'

export const uploadBufferToBucket = async (
  bucket: MongooseGridFSBucketType,
  buffer: Buffer | ArrayBuffer,
  filename: string,
  bucketName: MediaBucketNameType,
  language: AppLanguageType,
  options?: IUploadOptions
) => {
  try {
    const normalizedBuffer = buffer instanceof Buffer ? buffer : Buffer.from(new Uint8Array(buffer))
    const outBuffer = await processImageWithSharp(normalizedBuffer, options?.compression ?? 'common-compressed')

    const fileData = await buildFileData(outBuffer, filename)

    validateFileMetaData(fileData, bucketName, language)

    const overwrite = options?.overwrite ?? false

    const existing = await bucket.find({ filename: fileData.filename }).toArray()

    if (existing.length > 0) {
      if (!overwrite) {
        throw new AppError(
          StatusEnum.Server,
          localizedText(VALIDATE_MEDIA_FILE_I18N.fileWithThisNameAlreadyExists, language)
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
  } catch (error) {
    if (isAppError(error)) {
      throw error
    }

    throw new AppError(StatusEnum.Server, localizedText(VALIDATE_MEDIA_FILE_I18N.uploadFailed, language), false, error)
  }
}
