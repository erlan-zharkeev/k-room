import { Buffer } from 'node:buffer'

import { AppLanguage, REQ_STATUS } from 'common'

import { AppError, isAppError } from 'src/shared/lib/app-error'
import { localizedText } from 'src/shared/lib/localized-text'

import { VALIDATE_MEDIA_FILE_I18N } from '../config/i18n'
import { UploadOptions, MediaBucketName, MongooseGridFSBucket } from '../types'

import { buildFileData } from './build-file-data'
import { processImageWithSharp } from './process-image'
import { validateFileMetaData } from './validate-file-meta-data'

export const uploadBufferToBucket = async (
  bucket: MongooseGridFSBucket,
  buffer: Buffer | ArrayBuffer,
  filename: string,
  bucketName: MediaBucketName,
  language: AppLanguage,
  options?: UploadOptions
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
          REQ_STATUS.server,
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

    throw new AppError(REQ_STATUS.server, localizedText(VALIDATE_MEDIA_FILE_I18N.uploadFailed, language), false, error)
  }
}
