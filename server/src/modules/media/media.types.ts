import type { NextFunction, Request, Response } from 'express'
import type { MediaKind } from 'global-shared'
import type mongoose from 'mongoose'

export type SharpSettingsKey = 'avatar' | 'common-compressed' | 'common-uncompressed'

export type MulterHandler = (req: Request, res: Response, next: NextFunction) => void

export type MediaBucketName = 'avatar' | 'doc' | 'image' | 'audio' | 'video'

export type MulterErrorCode = 'LIMIT_FILE_SIZE' | 'LIMIT_FILE_COUNT' | 'LIMIT_UNEXPECTED_FILE'

export interface MediaBucketOptions {
  supportedKindMediaType: MediaKind
  maxMb: number
}

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

export interface StreamMediaFileOptions {
  asAttachment?: boolean
}

export type MongooseGridFSBucket = InstanceType<typeof mongoose.mongo.GridFSBucket>
