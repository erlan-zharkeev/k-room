import type { NextFunction, Request, Response } from 'express'
import type { MediaBucketName, MediaValidationOptions } from 'global-shared'
import type mongoose from 'mongoose'

export type SharpSettingsKey = 'avatar' | 'common-compressed' | 'common-uncompressed'

export type MulterHandler = (req: Request, res: Response, next: NextFunction) => void

export type MulterErrorCode = 'LIMIT_FILE_SIZE' | 'LIMIT_FILE_COUNT' | 'LIMIT_UNEXPECTED_FILE'

export interface FileMetadata {
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
  metadata: FileMetadata
}

export interface UploadedMediaFileData {
  id: string
  fileData: FileData
}

export interface StreamMediaFileData {
  filename: string
  contentType?: string
  uploadDate?: Date
  metadata?: Partial<FileMetadata>
}

export interface StreamMediaBucketFile {
  bucket: MongooseGridFSBucket
  file: StreamMediaFileData
}

export interface UploadOptions {
  compression?: SharpSettingsKey
  contentType?: string
  filename?: string
  id?: string
  overwrite?: boolean
  validation?: MediaValidationOptions
}

export type TrackUploadedMedia = (bucketName: MediaBucketName, id: string) => void

export type UploadedMediaCleanupCallback<TResult> = (trackUploadedMedia: TrackUploadedMedia) => Promise<TResult>

export interface UploadedMediaCleanupItem {
  bucketName: MediaBucketName
  id: string
}

export interface StreamMediaFileOptions {
  asAttachment?: boolean
}

export type MongooseGridFSBucket = InstanceType<typeof mongoose.mongo.GridFSBucket>
