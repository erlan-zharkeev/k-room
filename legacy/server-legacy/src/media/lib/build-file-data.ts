import fileTypeDep from 'file-type'
import imageSize from 'image-size'
import { lookup as mimeLookup } from 'mime-types'

import { IFileData, IFileMetaData } from '../types'

import { createSha256FromBuffer } from './create-sha-from-buffer'

export const buildFileData = async (buffer: Buffer, filename: string): Promise<IFileData> => {
  const fileType = await fileTypeDep.fromBuffer(buffer).catch(() => null)
  const contentType = fileType?.mime ?? (filename ? mimeLookup(filename) || undefined : undefined)

  const meta: IFileMetaData = {
    size: buffer.length,
    sha256: createSha256FromBuffer(buffer),
    detectedMime: fileType?.mime,
    detectedExt: fileType?.ext,
    kind: contentType?.split('/')[0]
  }

  if (contentType?.startsWith('image/')) {
    const dim = imageSize(buffer)
    if (dim?.width && dim?.height) {
      meta.width = dim.width
      meta.height = dim.height
      meta.orientation = (dim.width ?? 0) >= (dim.height ?? 0) ? 'landscape' : 'portrait'
    }
  }

  return {
    contentType,
    metadata: meta,
    filename
  }
}
