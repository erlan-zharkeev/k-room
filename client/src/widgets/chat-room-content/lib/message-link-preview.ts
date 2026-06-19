import { MESSAGE_LINK_PROTOCOL, type MessageLinkPreview } from 'global-shared'

const isMessageLinkPreviewHttpsUrl = (url: string) => {
  try {
    return new URL(url).protocol === MESSAGE_LINK_PROTOCOL
  } catch {
    return false
  }
}

export const canShowMessageLinkPreview = (preview: MessageLinkPreview) => {
  const isLoadedPreview = preview.status === 'loaded'
  const hasPreviewTitle = Boolean(preview.title)
  const hasPreviewDescription = Boolean(preview.description)
  const hasPreviewImage = Boolean(preview.image)
  const hasPreviewContent = hasPreviewTitle || hasPreviewDescription || hasPreviewImage
  const isHttpsPreviewUrl = isMessageLinkPreviewHttpsUrl(preview.url)

  return isLoadedPreview && hasPreviewContent && isHttpsPreviewUrl
}

export const resolveMessageLinkPreviewTitle = (preview: MessageLinkPreview) => preview.title || preview.host
