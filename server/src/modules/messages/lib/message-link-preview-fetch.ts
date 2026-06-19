import { request as httpsRequest } from 'node:https'

import { isHttpRedirectStatus, MESSAGE_LINK_PROTOCOL, isString } from 'global-shared'

import { MESSAGE_LINK_PREVIEW_FETCH_MAX_REDIRECTS, MESSAGE_LINK_PREVIEW_FETCH_TIMEOUT_MS } from '../messages.constants'
import type { MessageLinkPreviewFetchResponse } from '../messages.types'

import { createMessageLinkPreviewLookup } from './message-link-preview-address'

export const isAllowedMessageLinkPreviewUrl = (url: URL) =>
  url.protocol === MESSAGE_LINK_PROTOCOL && Boolean(url.hostname)

const getHeaderValue = (value: number | string | string[] | undefined) => {
  if (Array.isArray(value)) return value[0] ?? ''
  if (isString(value)) return value

  return ''
}

const fetchMessageLinkPreviewBuffer = (url: URL, maxBytes: number, userAgent: string) =>
  new Promise<MessageLinkPreviewFetchResponse>((resolve, reject) => {
    const request = httpsRequest(
      url,
      {
        headers: {
          accept: 'text/html,image/*',
          'user-agent': userAgent
        },
        lookup: createMessageLinkPreviewLookup(),
        signal: AbortSignal.timeout(MESSAGE_LINK_PREVIEW_FETCH_TIMEOUT_MS)
      },
      (response) => {
        const statusCode = response.statusCode ?? 0
        const contentType = getHeaderValue(response.headers['content-type'])
        const location = getHeaderValue(response.headers.location)

        if (isHttpRedirectStatus(statusCode)) {
          response.resume()
          resolve({ body: Buffer.alloc(0), contentType, location, statusCode })

          return
        }

        const chunks: Buffer[] = []
        let length = 0
        let isSettled = false

        const settle = (body: Buffer) => {
          if (isSettled) return

          isSettled = true
          resolve({ body, contentType, location, statusCode })
        }

        response.on('data', (chunk: Buffer) => {
          if (isSettled) return

          length += chunk.length
          chunks.push(chunk)

          if (length > maxBytes) {
            settle(Buffer.concat(chunks, maxBytes))
            response.destroy()
          }
        })
        response.on('end', () => {
          settle(Buffer.concat(chunks))
        })
        response.on('error', (error) => {
          if (isSettled) return

          reject(error)
        })
      }
    )

    request.on('error', reject)
    request.end()
  })

export const fetchMessageLinkPreviewUrl = async (
  url: URL,
  maxBytes: number,
  userAgent: string,
  redirectCount = 0
): Promise<MessageLinkPreviewFetchResponse> => {
  if (!isAllowedMessageLinkPreviewUrl(url)) throw new Error('Unsupported link preview URL')

  const response = await fetchMessageLinkPreviewBuffer(url, maxBytes, userAgent)
  const hasRedirectStatus = isHttpRedirectStatus(response.statusCode)
  const hasRedirectLocation = Boolean(response.location)
  const hasAvailableRedirectAttempt = redirectCount < MESSAGE_LINK_PREVIEW_FETCH_MAX_REDIRECTS
  const canRedirect = hasRedirectStatus && hasRedirectLocation && hasAvailableRedirectAttempt

  if (!canRedirect) return response

  const redirectUrl = new URL(response.location, url)

  return fetchMessageLinkPreviewUrl(redirectUrl, maxBytes, userAgent, redirectCount + 1)
}
