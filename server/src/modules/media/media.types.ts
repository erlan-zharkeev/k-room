import type { NextFunction, Request, Response } from 'express'
import type { MediaKindType } from 'global-shared'
import type mongoose from 'mongoose'

export type SharpSettingsKeyType = 'avatar' | 'common-compressed' | 'common-uncompressed'

export type MulterHandlerType = (req: Request, res: Response, next: NextFunction) => void

export type MediaBucketNameType = 'avatar' | 'doc' | 'image' | 'audio' | 'video'

export type MulterErrorCodeType = 'LIMIT_FILE_SIZE' | 'LIMIT_FILE_COUNT' | 'LIMIT_UNEXPECTED_FILE'

export interface IMediaBucketOptions {
  supportedKindMediaType: MediaKindType
  maxMb: number
}

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

export interface IStreamMediaFileOptions {
  asAttachment?: boolean
  revalidateCache?: boolean
}

export type MongooseGridFSBucketType = InstanceType<typeof mongoose.mongo.GridFSBucket>
