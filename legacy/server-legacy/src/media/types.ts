import { MediaKind } from 'common'
import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'

import { SharpSettingsKey } from '../shared/types/sharp'

import { MEDIA_BUCKET_NAMES } from './config/constants'

export type MulterHandler = (req: Request, res: Response, next: NextFunction) => void

export type RequestMulterFile = Express.Multer.File & {
  id?: string
  filename?: string
  contentType?: string
  bucketName?: string
}

export type MediaBucketName = (typeof MEDIA_BUCKET_NAMES)[number]

export type MulterErrorCode = 'LIMIT_FILE_SIZE' | 'LIMIT_FILE_COUNT' | 'LIMIT_UNEXPECTED_FILE'

export interface MediaBucketOptions {
  supportedKindMediaType: MediaKind
  maxMb: number
}

export type ValidateFileMetaOptionsMap = Record<MediaBucketName, MediaBucketOptions>

export type MongooseGridFSBucket = InstanceType<typeof mongoose.mongo.GridFSBucket>

export interface FileMetaData {
  size: number
  sha256: string
  detectedMime?: string
  detectedExt?: string
  kind?: string
  width?: number
  height?: number
  orientation?: 'landscape' | 'portrait'
}

export interface FileData {
  filename: string
  contentType?: string
  metadata: FileMetaData
}

export interface UploadOptions {
  overwrite?: boolean
  compression?: SharpSettingsKey
}
