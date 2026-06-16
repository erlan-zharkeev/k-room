import { EventEmitter } from 'node:events'

import { MESSAGE_LINK_PREVIEW_STATUS } from 'global-shared'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const dnsMock = vi.hoisted(() => ({
  lookup: vi.fn()
}))

const httpsMock = vi.hoisted(() => ({
  request: vi.fn()
}))

const mediaMock = vi.hoisted(() => ({
  uploadBufferToBucket: vi.fn(),
  uploadBufferToBucketWithFileData: vi.fn()
}))

vi.mock('node:dns/promises', () => ({
  lookup: dnsMock.lookup
}))

vi.mock('node:https', () => ({
  request: httpsMock.request
}))

vi.mock('../../media/media.service', () => mediaMock)

const { loadMessageLinkPreview } = await import('./load-message-link-preview')

const createMockIncomingMessage = ({
  body,
  contentType,
  statusCode
}: {
  body: Buffer
  contentType: string
  statusCode: number
}) => {
  const response = new EventEmitter() as EventEmitter & {
    headers: Record<string, string>
    resume: () => void
    statusCode: number
  }

  response.statusCode = statusCode
  response.headers = { 'content-type': contentType }
  response.resume = vi.fn()

  queueMicrotask(() => {
    response.emit('data', body)
    response.emit('end')
  })

  return response
}

const mockHttpsResponses = (
  responses: {
    body: Buffer
    contentType: string
    statusCode: number
  }[]
) => {
  const lookupCallbackResults: unknown[] = []

  httpsMock.request.mockImplementation(
    (
      url: URL,
      options: {
        headers: Record<string, string>
        lookup: (
          hostname: string,
          requestOptions: { all: true },
          callback: (error: Error | null, addresses: unknown) => void
        ) => void
      },
      callback: (response: ReturnType<typeof createMockIncomingMessage>) => void
    ) => {
      const request = new EventEmitter() as EventEmitter & { end: () => void }

      request.end = () => {
        options.lookup(url.hostname, { all: true }, (error: Error | null, addresses: unknown) => {
          if (error) {
            request.emit('error', error)

            return
          }

          lookupCallbackResults.push(addresses)
          const response = responses.shift()

          if (!response) {
            request.emit('error', new Error('Missing mocked response'))

            return
          }

          callback(createMockIncomingMessage(response))
        })
      }

      return request
    }
  )

  return lookupCallbackResults
}

describe('loadMessageLinkPreview', () => {
  beforeEach(() => {
    dnsMock.lookup.mockResolvedValue([{ address: '93.184.216.34', family: 4 }])
    mediaMock.uploadBufferToBucketWithFileData.mockResolvedValue({
      id: 'image-id',
      fileData: {
        filename: 'image-id',
        metadata: {
          height: 20,
          size: 10,
          sha256: 'sha',
          width: 30
        }
      }
    })
  })

  it('loads metadata and image through protected https lookup with all addresses callback', async () => {
    const lookupCallbackResults = mockHttpsResponses([
      {
        statusCode: 200,
        contentType: 'text/html; charset=utf-8',
        body: Buffer.from(`
          <html>
            <head>
              <meta property="og:title" content="Example title">
              <meta property="og:description" content="Example description">
              <meta property="og:image" content="https://example.com/image.png">
            </head>
          </html>
        `)
      },
      {
        statusCode: 200,
        contentType: 'image/png',
        body: Buffer.from('image-data')
      }
    ])

    const preview = await loadMessageLinkPreview({
      appName: 'Test App',
      preview: {
        url: 'https://example.com/',
        host: 'example.com',
        status: MESSAGE_LINK_PREVIEW_STATUS.PENDING
      }
    })

    expect(preview).toEqual({
      url: 'https://example.com/',
      host: 'example.com',
      status: MESSAGE_LINK_PREVIEW_STATUS.LOADED,
      title: 'Example title',
      description: 'Example description',
      image: {
        src: 'image-id',
        name: 'example.com',
        aspectRatio: 1.5
      }
    })
    expect(lookupCallbackResults).toEqual([
      [{ address: '93.184.216.34', family: 4 }],
      [{ address: '93.184.216.34', family: 4 }]
    ])
    expect(mediaMock.uploadBufferToBucketWithFileData).toHaveBeenCalledWith(Buffer.from('image-data'), 'image')
    expect(httpsMock.request).toHaveBeenCalledWith(
      expect.any(URL),
      expect.objectContaining({
        headers: expect.objectContaining({ 'user-agent': 'Test App link preview bot' })
      }),
      expect.any(Function)
    )
  })

  it('fails preview loading when resolved address is private', async () => {
    dnsMock.lookup.mockResolvedValue([{ address: '127.0.0.1', family: 4 }])
    mockHttpsResponses([
      {
        statusCode: 200,
        contentType: 'text/html',
        body: Buffer.from('<title>Blocked</title>')
      }
    ])

    const preview = await loadMessageLinkPreview({
      appName: 'Test App',
      preview: {
        url: 'https://example.com/',
        host: 'example.com',
        status: MESSAGE_LINK_PREVIEW_STATUS.PENDING
      }
    })

    expect(preview.status).toBe(MESSAGE_LINK_PREVIEW_STATUS.FAILED)
    expect(mediaMock.uploadBufferToBucketWithFileData).not.toHaveBeenCalled()
  })
})
