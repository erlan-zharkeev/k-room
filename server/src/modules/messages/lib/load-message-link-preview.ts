import type { LookupAddress } from 'node:dns'
import { lookup } from 'node:dns/promises'
import { request as httpsRequest } from 'node:https'
import { isIP } from 'node:net'
import type { LookupFunction } from 'node:net'

import {
  isHttpRedirectStatus,
  isHttpSuccessStatus,
  MESSAGE_LINK_PREVIEW_STATUS,
  MESSAGE_LINK_PROTOCOL,
  isString,
  type MessageLinkPreview
} from 'global-shared'

import { buildImageAspectRatioDetails } from '../../media/lib/build-image-aspect-ratio-details'
import { uploadBufferToBucketWithFileData } from '../../media/media.service'
import {
  MESSAGE_LINK_PREVIEW_ALLOWED_HTML_CONTENT_TYPES,
  MESSAGE_LINK_PREVIEW_ATTRIBUTE_PATTERN,
  MESSAGE_LINK_PREVIEW_DESCRIPTION_META_KEYS,
  MESSAGE_LINK_PREVIEW_FETCH_MAX_REDIRECTS,
  MESSAGE_LINK_PREVIEW_FETCH_TIMEOUT_MS,
  MESSAGE_LINK_PREVIEW_HTML_ENTITY_MAP,
  MESSAGE_LINK_PREVIEW_HTML_ENTITY_PATTERN,
  MESSAGE_LINK_PREVIEW_HTML_MAX_BYTES,
  MESSAGE_LINK_PREVIEW_IMAGE_MAX_BYTES,
  MESSAGE_LINK_PREVIEW_IMAGE_META_KEYS,
  MESSAGE_LINK_PREVIEW_META_TAG_PATTERN,
  MESSAGE_LINK_PREVIEW_PRIVATE_IPV4_CIDRS,
  MESSAGE_LINK_PREVIEW_PRIVATE_IPV6_EXACT_ADDRESSES,
  MESSAGE_LINK_PREVIEW_PRIVATE_IPV6_PREFIXES,
  MESSAGE_LINK_PREVIEW_TITLE_META_KEYS,
  MESSAGE_LINK_PREVIEW_TITLE_TAG_PATTERN,
  MESSAGE_LINK_PREVIEW_USER_AGENT,
  MESSAGE_LINK_PREVIEW_WHITESPACE_PATTERN
} from '../constants'

const parseIpv4Address = (address: string) => {
  const parts = address.split('.').map(Number)
  const hasValidPartCount = parts.length === 4
  const hasValidParts = parts.every((part) => {
    const isInteger = Number.isInteger(part)
    const isInMinRange = part >= 0
    const isInMaxRange = part <= 255

    return isInteger && isInMinRange && isInMaxRange
  })

  if (!hasValidPartCount || !hasValidParts) return null

  return parts.reduce((value, part) => value * 256 + part, 0) >>> 0
}

const isIpv4AddressInCidr = (address: string, cidr: string) => {
  const addressValue = parseIpv4Address(address)
  const [rangeAddress, rangePrefix] = cidr.split('/')
  const rangeValue = parseIpv4Address(rangeAddress)
  const prefix = Number(rangePrefix)
  const hasInvalidAddress = addressValue === null
  const hasInvalidRangeAddress = rangeValue === null
  const hasInvalidPrefix = !Number.isInteger(prefix)
  const hasInvalidRange = hasInvalidAddress || hasInvalidRangeAddress || hasInvalidPrefix

  if (hasInvalidRange) return false

  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0

  return (addressValue & mask) === (rangeValue & mask)
}

const isPrivateIpv4Address = (address: string) =>
  MESSAGE_LINK_PREVIEW_PRIVATE_IPV4_CIDRS.some((cidr) => isIpv4AddressInCidr(address, cidr))

const isPrivateIpv6Address = (address: string) => {
  const normalizedAddress = address.toLowerCase()
  const mappedIpv4Address = normalizedAddress.match(/::ffff:(\d+\.\d+\.\d+\.\d+)$/u)?.[1]

  if (mappedIpv4Address) return isPrivateIpv4Address(mappedIpv4Address)

  const hasExactPrivateAddress = MESSAGE_LINK_PREVIEW_PRIVATE_IPV6_EXACT_ADDRESSES.some(
    (address) => address === normalizedAddress
  )
  const hasPrivatePrefix = MESSAGE_LINK_PREVIEW_PRIVATE_IPV6_PREFIXES.some((prefix) =>
    normalizedAddress.startsWith(prefix)
  )

  return hasExactPrivateAddress || hasPrivatePrefix
}

const isPrivateAddress = (address: string) => {
  const ipVersion = isIP(address)

  if (ipVersion === 4) return isPrivateIpv4Address(address)
  if (ipVersion === 6) return isPrivateIpv6Address(address)

  return true
}

const resolveMessageLinkPreviewAddresses = async (hostname: string): Promise<LookupAddress[] | null> => {
  const addresses = await lookup(hostname, { all: true, verbatim: false })
  const hasPrivateAddress = addresses.some(({ address }) => isPrivateAddress(address))

  if (!addresses.length || hasPrivateAddress) return null

  return addresses
}

const createMessageLinkPreviewLookup = (): LookupFunction => (hostname, _options, callback) => {
  void resolveMessageLinkPreviewAddresses(hostname)
    .then((addresses) => {
      if (!addresses) {
        callback(new Error('Blocked link preview address'), '', 0)

        return
      }

      if (_options.all) {
        callback(null, addresses)

        return
      }

      const [address] = addresses

      callback(null, address.address, address.family)
    })
    .catch((error: Error) => {
      callback(error, '', 0)
    })
}

const isAllowedMessageLinkPreviewUrl = (url: URL) => url.protocol === MESSAGE_LINK_PROTOCOL && Boolean(url.hostname)

const getHeaderValue = (value: number | string | string[] | undefined) => {
  if (Array.isArray(value)) return value[0] ?? ''
  if (isString(value)) return value

  return ''
}

const fetchMessageLinkPreviewBuffer = (url: URL, maxBytes: number) =>
  new Promise<{ body: Buffer; contentType: string; location: string; statusCode: number }>((resolve, reject) => {
    const request = httpsRequest(
      url,
      {
        headers: {
          accept: 'text/html,image/*',
          'user-agent': MESSAGE_LINK_PREVIEW_USER_AGENT
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

const fetchMessageLinkPreviewUrl = async (url: URL, maxBytes: number, redirectCount = 0) => {
  if (!isAllowedMessageLinkPreviewUrl(url)) throw new Error('Unsupported link preview URL')

  const response = await fetchMessageLinkPreviewBuffer(url, maxBytes)
  const hasRedirectStatus = isHttpRedirectStatus(response.statusCode)
  const hasRedirectLocation = Boolean(response.location)
  const hasAvailableRedirectAttempt = redirectCount < MESSAGE_LINK_PREVIEW_FETCH_MAX_REDIRECTS
  const canRedirect = hasRedirectStatus && hasRedirectLocation && hasAvailableRedirectAttempt

  if (!canRedirect) return response

  const redirectUrl = new URL(response.location, url)

  return fetchMessageLinkPreviewUrl(redirectUrl, maxBytes, redirectCount + 1)
}

const isHtmlContentType = (contentType: string) =>
  !contentType || MESSAGE_LINK_PREVIEW_ALLOWED_HTML_CONTENT_TYPES.some((type) => contentType.includes(type))

const decodeMessageLinkPreviewText = (value: string) =>
  value
    .replace(MESSAGE_LINK_PREVIEW_HTML_ENTITY_PATTERN, (_entity, entity: string) => {
      const normalizedEntity = entity.toLowerCase()

      if (normalizedEntity.startsWith('#x')) {
        return String.fromCodePoint(Number.parseInt(normalizedEntity.slice(2), 16))
      }

      if (normalizedEntity.startsWith('#')) {
        return String.fromCodePoint(Number.parseInt(normalizedEntity.slice(1), 10))
      }

      return (
        MESSAGE_LINK_PREVIEW_HTML_ENTITY_MAP[normalizedEntity as keyof typeof MESSAGE_LINK_PREVIEW_HTML_ENTITY_MAP] ??
        ''
      )
    })
    .replace(MESSAGE_LINK_PREVIEW_WHITESPACE_PATTERN, ' ')
    .trim()

const readMetaTagAttributes = (tag: string) => {
  const attributes = new Map<string, string>()

  for (const match of tag.matchAll(MESSAGE_LINK_PREVIEW_ATTRIBUTE_PATTERN)) {
    const [, rawName, doubleQuotedValue, singleQuotedValue, unquotedValue] = match
    const value = doubleQuotedValue ?? singleQuotedValue ?? unquotedValue

    if (!rawName || !value) continue

    attributes.set(rawName.toLowerCase(), decodeMessageLinkPreviewText(value))
  }

  return attributes
}

const readMetaValueByKeys = (html: string, keys: readonly string[]) => {
  for (const match of html.matchAll(MESSAGE_LINK_PREVIEW_META_TAG_PATTERN)) {
    const [tag] = match
    const attributes = readMetaTagAttributes(tag)
    const key = attributes.get('property') ?? attributes.get('name')
    const content = attributes.get('content')
    const hasMatchedKey = key && keys.includes(key.toLowerCase())

    if (hasMatchedKey && content) return content
  }

  return ''
}

const readTitleTagValue = (html: string) => {
  const title = html.match(MESSAGE_LINK_PREVIEW_TITLE_TAG_PATTERN)?.[1]

  return title ? decodeMessageLinkPreviewText(title) : ''
}

const resolveMessageLinkPreviewImageUrl = (value: string, baseUrl: URL) => {
  if (!value) return null

  const url = new URL(value, baseUrl)

  return isAllowedMessageLinkPreviewUrl(url) ? url : null
}

const loadMessageLinkPreviewImage = async (imageUrl: URL) => {
  try {
    const response = await fetchMessageLinkPreviewUrl(imageUrl, MESSAGE_LINK_PREVIEW_IMAGE_MAX_BYTES)
    const isImageResponse = isHttpSuccessStatus(response.statusCode) && response.contentType.startsWith('image/')

    if (!isImageResponse) return undefined

    const { fileData, id } = await uploadBufferToBucketWithFileData(response.body, 'image')

    return {
      src: id,
      name: imageUrl.hostname,
      ...buildImageAspectRatioDetails(fileData.metadata)
    }
  } catch {
    return undefined
  }
}

export const loadMessageLinkPreview = async (preview: MessageLinkPreview): Promise<MessageLinkPreview> => {
  try {
    const url = new URL(preview.url)
    const response = await fetchMessageLinkPreviewUrl(url, MESSAGE_LINK_PREVIEW_HTML_MAX_BYTES)
    const canReadHtml = isHttpSuccessStatus(response.statusCode) && isHtmlContentType(response.contentType)

    if (!canReadHtml) throw new Error('Link preview HTML is unavailable')

    const html = response.body.toString('utf8')
    const title = readMetaValueByKeys(html, MESSAGE_LINK_PREVIEW_TITLE_META_KEYS) || readTitleTagValue(html)
    const description = readMetaValueByKeys(html, MESSAGE_LINK_PREVIEW_DESCRIPTION_META_KEYS)
    const imageUrl = resolveMessageLinkPreviewImageUrl(
      readMetaValueByKeys(html, MESSAGE_LINK_PREVIEW_IMAGE_META_KEYS),
      url
    )
    const image = imageUrl ? await loadMessageLinkPreviewImage(imageUrl) : undefined

    return {
      ...preview,
      status: MESSAGE_LINK_PREVIEW_STATUS.LOADED,
      ...(title && { title }),
      ...(description && { description }),
      ...(image && { image })
    }
  } catch {
    return {
      ...preview,
      status: MESSAGE_LINK_PREVIEW_STATUS.FAILED
    }
  }
}
