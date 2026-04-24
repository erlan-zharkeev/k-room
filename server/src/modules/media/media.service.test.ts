import { beforeEach, describe, expect, it, vi } from 'vitest'

const mongooseMock = vi.hoisted(() => ({
  bucket: {
    find: vi.fn(),
    delete: vi.fn(),
    openUploadStream: vi.fn()
  },
  GridFSBucket: vi.fn()
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
      toArray: vi.fn().mockResolvedValue([{ _id: 'old-file' }])
    })
    mongooseMock.bucket.openUploadStream.mockImplementation(() => createUploadStream())
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

  it('overwrites existing avatar file and stores processed image metadata', async () => {
    const result = await mediaService.uploadBufferToBucket(Buffer.from('raw'), 'avatar.user-1', 'avatar', 'en', {
      overwrite: true,
      compression: 'avatar'
    })

    expect(result).toBe('stored-file-id')
    expect(mongooseMock.bucket.delete).toHaveBeenCalledWith('old-file')
    expect(mongooseMock.bucket.openUploadStream).toHaveBeenCalledWith(
      'avatar.user-1',
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

    await expect(
      mediaService.uploadBufferToBucket(Buffer.from('raw'), 'image.bad.txt', 'image', 'en')
    ).rejects.toMatchObject({ status: 400 })

    expect(mongooseMock.bucket.openUploadStream).not.toHaveBeenCalled()
  })
})
