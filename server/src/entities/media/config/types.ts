import type { MediaKindType } from 'common'
import type { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'

import { SharpSettingsKeyType } from 'src/shared/config'

import { MEDIA_BUCKET_NAMES } from '.'

export type MulterHandlerType = (req: Request, res: Response, next: NextFunction) => void

export type RequestMulterFileType = Express.Multer.File & {
  id?: string
  filename?: string
  contentType?: string
  bucketName?: string
}

export type MediaBucketNameType = (typeof MEDIA_BUCKET_NAMES)[number]

export type MulterErrorCodeType = 'LIMIT_FILE_SIZE' | 'LIMIT_FILE_COUNT' | 'LIMIT_UNEXPECTED_FILE'

export interface IMediaBucketOptions {
  supportedKindMediaType: MediaKindType
  maxMb: number
}

export type ValidateFileMetaOptionsMapType = Record<MediaBucketNameType, IMediaBucketOptions>

export type MongooseGridFSBucketType = InstanceType<typeof mongoose.mongo.GridFSBucket>

export interface IFileMetaData {
  size: number
  sha256: string
  detectedMime?: string
  detectedExt?: string
  kind?: string
  width?: number
  height?: number
  orientation?: 'landscape' | 'portrait'
}

export interface IFileData {
  filename: string
  contentType?: string
  metadata: IFileMetaData
}

export interface IUploadOptions {
  overwrite?: boolean
  compression?: SharpSettingsKeyType
}
