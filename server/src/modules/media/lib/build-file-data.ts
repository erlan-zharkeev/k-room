import { Buffer } from 'node:buffer'
import { createHash } from 'node:crypto'

import fileTypeDep from 'file-type'
import { MEDIA_KIND_ACCEPT_MAP } from 'global-shared'
import imageSize from 'image-size'
import { lookup as mimeLookup } from 'mime-types'

import type { FileData, FileMetaData } from '../media.types'

const createSha256FromBuffer = (buffer: Buffer) => {
  return createHash('sha256').update(buffer).digest('hex')
}

const resolveMediaKind = (contentType?: string) => {
  if (contentType === MEDIA_KIND_ACCEPT_MAP.pdf) return 'pdf'

  return contentType?.split('/')[0]
}

export const buildFileData = async (buffer: Buffer, filename: string): Promise<FileData> => {
  const fileType = await fileTypeDep.fromBuffer(buffer).catch(() => null)
  const contentType = fileType?.mime ?? (filename ? mimeLookup(filename) || undefined : undefined)
  const metadata: FileMetaData = {
    size: buffer.length,
    sha256: createSha256FromBuffer(buffer),
    detectedMime: fileType?.mime,
    detectedExt: fileType?.ext,
    kind: resolveMediaKind(contentType)
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
