import type { MediaBucketName } from 'global-shared'
import { model, Schema, type Model, type Types } from 'mongoose'

import type { FileMetadata } from './media.types'

interface MediaFileSchema {
  _id: Types.ObjectId
  chunkSize?: number
  contentType?: string
  filename: string
  length?: number
  metadata?: Partial<FileMetadata>
  uploadDate?: Date
}

const mediaFileMetadataSchema = new Schema<Partial<FileMetadata>>(
  {
    detectedExt: {
      type: String,
      required: false
    },
    detectedMime: {
      type: String,
      required: false
    },
    height: {
      type: Number,
      required: false
    },
    kind: {
      type: String,
      required: false
    },
    orientation: {
      type: String,
      required: false
    },
    sha256: {
      type: String,
      required: false
    },
    size: {
      type: Number,
      required: false
    },
    width: {
      type: Number,
      required: false
    }
  },
  { _id: false, strict: false }
)

const mediaFileSchema = new Schema<MediaFileSchema>(
  {
    chunkSize: {
      type: Number,
      required: false
    },
    contentType: {
      type: String,
      required: false
    },
    filename: {
      type: String,
      required: true
    },
    length: {
      type: Number,
      required: false
    },
    metadata: {
      type: mediaFileMetadataSchema,
      required: false
    },
    uploadDate: {
      type: Date,
      required: false
    }
  },
  { strict: false, versionKey: false }
)

const ImageMediaFileModel = model<MediaFileSchema>('ImageMediaFile', mediaFileSchema, 'image.files')
const DocumentMediaFileModel = model<MediaFileSchema>('DocumentMediaFile', mediaFileSchema, 'doc.files')
const AudioMediaFileModel = model<MediaFileSchema>('AudioMediaFile', mediaFileSchema, 'audio.files')
const VideoMediaFileModel = model<MediaFileSchema>('VideoMediaFile', mediaFileSchema, 'video.files')

export const MEDIA_FILE_MODEL_BY_BUCKET = {
  audio: AudioMediaFileModel,
  doc: DocumentMediaFileModel,
  image: ImageMediaFileModel,
  video: VideoMediaFileModel
} as const satisfies Record<MediaBucketName, Model<MediaFileSchema>>
