import { Buffer } from 'node:buffer'
import { createHash } from 'node:crypto'

import fileTypeDep from 'file-type'
import {
  MEDIA_DOCUMENT_UPLOAD_EXTENSIONS,
  MEDIA_KIND_ACCEPT_MAP,
  MEDIA_KIND_ALLOWED_UPLOAD_TYPES_MAP
} from 'global-shared'
import imageSize from 'image-size'
import { lookup as mimeLookup } from 'mime-types'

import type { FileData, FileMetadata } from '../media.types'

const createSha256FromBuffer = (buffer: Buffer) => {
  return createHash('sha256').update(buffer).digest('hex')
}

const resolveFileExtension = (filename: string) => filename.split('.').pop()?.toLowerCase()

const resolveMediaKind = (contentType?: string, extension?: string) => {
  if (contentType === MEDIA_KIND_ACCEPT_MAP.pdf) return 'pdf'
  if (extension && (MEDIA_KIND_ALLOWED_UPLOAD_TYPES_MAP.archive as readonly string[]).includes(extension)) {
    return 'archive'
  }
  if (extension && (MEDIA_DOCUMENT_UPLOAD_EXTENSIONS as readonly string[]).includes(extension)) {
    return 'document'
  }

  return contentType?.split('/')[0]
}

export const buildFileData = async (
  buffer: Buffer,
  filename: string,
  fallbackContentType?: string
): Promise<FileData> => {
  const fileType = await fileTypeDep.fromBuffer(buffer).catch(() => null)
  const extension = fileType?.ext ?? resolveFileExtension(filename)
  const contentType =
    fileType?.mime ?? fallbackContentType ?? (filename ? mimeLookup(filename) || undefined : undefined)
  const metadata: FileMetadata = {
    size: buffer.length,
    sha256: createSha256FromBuffer(buffer),
    detectedMime: fileType?.mime,
    detectedExt: extension,
    kind: resolveMediaKind(contentType, extension)
  }

  if (contentType?.startsWith('image/')) {
    const size = imageSize(buffer)

    if (size.width && size.height) {
      metadata.width = size.width
      metadata.height = size.height
      metadata.orientation = size.width >= size.height ? 'landscape' : 'portrait'
    }
  }

  return {
    filename,
    contentType,
    metadata
  }
}
