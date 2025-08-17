import { StatusEnum } from 'common-types'
import type { Response } from 'express'
import { errorToMessage, throwHTTPError } from 'shared-lib'

import type { IUploadOptions, MediaBucketNameType, MongooseGridFSBucketType } from '../config'
import { VALIDATE_MEDIA_FILE_MESSAGE } from '../config'
import { buildFileData } from './build-file-data'
import { validateFileMetaData } from './validate-file-meta-data'

export const uploadBufferToBucket = async (
  bucket: MongooseGridFSBucketType,
  buffer: Buffer,
  filename: string,
  bucketName: MediaBucketNameType,
  res?: Response,
  options?: IUploadOptions
) => {
  try {
    const fileData = await buildFileData(buffer, filename)

    validateFileMetaData(fileData, bucketName)

    const overwrite = options?.overwrite ?? false

    const existing = await bucket.find({ filename: fileData.filename }).toArray()

    if (existing.length > 0) {
      if (!overwrite) {
        throw new Error(VALIDATE_MEDIA_FILE_MESSAGE.fileWithThisNameAlreadyExists)
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
      stream.end(buffer)
    })
  } catch (e: unknown) {
    const message = errorToMessage(e, VALIDATE_MEDIA_FILE_MESSAGE.uploadFailed)
    throwHTTPError(StatusEnum.Server, res ?? null, message, false)
  }
}
