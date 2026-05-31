import { beforeEach, describe, expect, it, vi } from 'vitest'

const mongooseMock = vi.hoisted(() => ({
  bucket: {
    find: vi.fn(),
    delete: vi.fn(),
    openUploadStreamWithId: vi.fn()
  },
  GridFSBucket: vi.fn(),
  ObjectId: class {
    value: string

    constructor(value?: string) {
      this.value = value ?? '68f000000000000000000099'
    }

    static isValid() {
      return true
    }

    toString() {
      return this.value
    }
  }
}))

const fileTypeMock = vi.hoisted(() => ({
  fromBuffer: vi.fn()
}))

const imageSizeMock = vi.hoisted(() => vi.fn())
const mimeLookupMock = vi.hoisted(() => vi.fn())
const sharpMock = vi.hoisted(() => vi.fn())

vi.mock('mongoose', () => ({
  default: {
    connection: {
      db: {}
    },
    mongo: {
      GridFSBucket: mongooseMock.GridFSBucket
    },
    Types: {
      ObjectId: mongooseMock.ObjectId
    }
  }
}))
vi.mock('file-type', () => ({
  default: fileTypeMock
}))
vi.mock('image-size', () => ({
  default: imageSizeMock
}))
vi.mock('mime-types', () => ({
  lookup: mimeLookupMock
}))
vi.mock('sharp', () => ({
  default: sharpMock
}))

const mediaService = await import('./media.service')

const createUploadStream = () => {
  const callbacks: Record<string, () => void> = {}
  const stream = {
    id: 'stored-file-id',
    once: vi.fn((event: string, callback: () => void) => {
      callbacks[event] = callback
      return stream
    }),
    end: vi.fn(() => {
      callbacks.finish?.()
    })
  }

  return stream
}

describe('media.service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mongooseMock.GridFSBucket.mockReturnValue(mongooseMock.bucket)
    mongooseMock.bucket.find.mockReturnValue({
      next: vi.fn().mockResolvedValue({ _id: 'old-file' })
    })
    mongooseMock.bucket.openUploadStreamWithId.mockImplementation(() => createUploadStream())
    fileTypeMock.fromBuffer.mockResolvedValue({ mime: 'image/webp', ext: 'webp' })
    imageSizeMock.mockReturnValue({ width: 10, height: 20 })
    mimeLookupMock.mockReturnValue('image/webp')
    sharpMock.mockImplementation(() => {
      const chain = {
        rotate: vi.fn(() => chain),
        resize: vi.fn(() => chain),
        toFormat: vi.fn(() => chain),
        toBuffer: vi.fn().mockResolvedValue(Buffer.from('processed'))
      }

      return chain
    })
    mediaService.initMediaBuckets()
  })

  it('overwrites existing image file and stores processed image metadata', async () => {
    const fileId = '68f000000000000000000010'
    const result = await mediaService.uploadBufferToBucket(Buffer.from('raw'), 'image', {
      id: fileId,
      overwrite: true,
      compression: 'avatar'
    })

    expect(result).toBe(fileId)
    expect(mongooseMock.bucket.delete).toHaveBeenCalledWith(expect.any(mongooseMock.ObjectId))
    expect(mongooseMock.bucket.openUploadStreamWithId).toHaveBeenCalledWith(
      expect.any(mongooseMock.ObjectId),
      fileId,
      expect.objectContaining({
        contentType: 'image/webp',
        metadata: expect.objectContaining({
          kind: 'image',
          width: 10,
          height: 20,
          orientation: 'portrait'
        })
      })
    )
  })

  it('rejects files whose detected media kind does not match bucket purpose', async () => {
    fileTypeMock.fromBuffer.mockResolvedValue(null)
    mimeLookupMock.mockReturnValue('text/plain')

    await expect(mediaService.uploadBufferToBucket(Buffer.from('raw'), 'image')).rejects.toMatchObject({ status: 400 })

    expect(mongooseMock.bucket.openUploadStreamWithId).not.toHaveBeenCalled()
  })

  it('stores pdf files in the document bucket', async () => {
    fileTypeMock.fromBuffer.mockResolvedValue({ mime: 'application/pdf', ext: 'pdf' })

    await mediaService.uploadBufferToBucket(Buffer.from('%PDF'), 'doc')

    expect(mongooseMock.bucket.openUploadStreamWithId).toHaveBeenCalledWith(
      expect.any(mongooseMock.ObjectId),
      '68f000000000000000000099',
      expect.objectContaining({
        contentType: 'application/pdf',
        metadata: expect.objectContaining({
          kind: 'pdf'
        })
      })
    )
  })

  it('stores archive files in the document bucket', async () => {
    fileTypeMock.fromBuffer.mockResolvedValue(null)

    await mediaService.uploadBufferToBucket(Buffer.from('zip'), 'doc', {
      contentType: 'application/zip',
      filename: 'archive.zip'
    })

    expect(mongooseMock.bucket.openUploadStreamWithId).toHaveBeenCalledWith(
      expect.any(mongooseMock.ObjectId),
      'archive.zip',
      expect.objectContaining({
        contentType: 'application/zip',
        metadata: expect.objectContaining({
          kind: 'archive'
        })
      })
    )
  })

  it('stores video files using provided file metadata fallback', async () => {
    fileTypeMock.fromBuffer.mockResolvedValue(null)

    const result = await mediaService.uploadBufferToBucket(Buffer.from('video'), 'video', {
      contentType: 'video/mp4',
      filename: 'clip.mp4'
    })

    expect(result).toBe('68f000000000000000000099')
    expect(mongooseMock.bucket.openUploadStreamWithId).toHaveBeenCalledWith(
      expect.any(mongooseMock.ObjectId),
      'clip.mp4',
      expect.objectContaining({
        contentType: 'video/mp4',
        metadata: expect.objectContaining({
          kind: 'video'
        })
      })
    )
  })

  it('removes tracked uploaded media when scoped work fails', async () => {
    await expect(
      mediaService.withUploadedMediaCleanup(async (trackUploadedMedia) => {
        trackUploadedMedia('image', '68f000000000000000000011')

        throw new Error('failed after upload')
      })
    ).rejects.toThrow('failed after upload')

    expect(mongooseMock.bucket.delete).toHaveBeenCalledWith(expect.any(mongooseMock.ObjectId))
  })
})
