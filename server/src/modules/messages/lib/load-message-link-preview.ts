import { isHttpSuccessStatus, type MessageLinkPreview } from 'global-shared'

import { buildImageAspectRatioDetails } from '../../media/lib/build-image-aspect-ratio-details'
import { uploadBufferToBucketWithFileData } from '../../media/media.service'
import {
  MESSAGE_LINK_PREVIEW_ALLOWED_HTML_CONTENT_TYPES,
  MESSAGE_LINK_PREVIEW_DESCRIPTION_META_KEYS,
  MESSAGE_LINK_PREVIEW_HTML_MAX_BYTES,
  MESSAGE_LINK_PREVIEW_IMAGE_MAX_BYTES,
  MESSAGE_LINK_PREVIEW_IMAGE_META_KEYS,
  MESSAGE_LINK_PREVIEW_TITLE_META_KEYS
} from '../messages.constants'
import type { LoadMessageLinkPreviewParams } from '../messages.types'

import { buildMessageLinkPreviewUserAgent } from './build-message-link-preview-user-agent'
import { fetchMessageLinkPreviewUrl, isAllowedMessageLinkPreviewUrl } from './message-link-preview-fetch'
import { readMessageLinkPreviewMetaValueByKeys, readMessageLinkPreviewTitleTagValue } from './message-link-preview-html'

const isHtmlContentType = (contentType: string) =>
  !contentType || MESSAGE_LINK_PREVIEW_ALLOWED_HTML_CONTENT_TYPES.some((type) => contentType.includes(type))

const resolveMessageLinkPreviewImageUrl = (value: string, baseUrl: URL) => {
  if (!value) return null

  const url = new URL(value, baseUrl)

  return isAllowedMessageLinkPreviewUrl(url) ? url : null
}

const loadMessageLinkPreviewImage = async (imageUrl: URL, userAgent: string) => {
  try {
    const response = await fetchMessageLinkPreviewUrl(imageUrl, MESSAGE_LINK_PREVIEW_IMAGE_MAX_BYTES, userAgent)
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

export const loadMessageLinkPreview = async ({
  appName,
  preview
}: LoadMessageLinkPreviewParams): Promise<MessageLinkPreview> => {
  try {
    const url = new URL(preview.url)
    const userAgent = buildMessageLinkPreviewUserAgent(appName)
    const response = await fetchMessageLinkPreviewUrl(url, MESSAGE_LINK_PREVIEW_HTML_MAX_BYTES, userAgent)
    const canReadHtml = isHttpSuccessStatus(response.statusCode) && isHtmlContentType(response.contentType)

    if (!canReadHtml) throw new Error('Link preview HTML is unavailable')

    const html = response.body.toString('utf8')
    const title =
      readMessageLinkPreviewMetaValueByKeys(html, MESSAGE_LINK_PREVIEW_TITLE_META_KEYS) ||
      readMessageLinkPreviewTitleTagValue(html)
    const description = readMessageLinkPreviewMetaValueByKeys(html, MESSAGE_LINK_PREVIEW_DESCRIPTION_META_KEYS)
    const imageUrl = resolveMessageLinkPreviewImageUrl(
      readMessageLinkPreviewMetaValueByKeys(html, MESSAGE_LINK_PREVIEW_IMAGE_META_KEYS),
      url
    )
    const image = imageUrl ? await loadMessageLinkPreviewImage(imageUrl, userAgent) : undefined

    return {
      ...preview,
      status: 'loaded',
      ...(title && { title }),
      ...(description && { description }),
      ...(image && { image })
    }
  } catch {
    return {
      ...preview,
      status: 'failed'
    }
  }
}
