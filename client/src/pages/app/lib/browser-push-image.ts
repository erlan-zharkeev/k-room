import type { MediaId } from 'global-shared'

import { canShowBrowserPush, showBrowserPush } from 'src/shared/lib'

import type { BrowserPushMediaGetter } from './types'

const createBrowserPushImageUrl = async (imageId: MediaId, getMedia: BrowserPushMediaGetter) => {
  if (!imageId) return
  if (!canShowBrowserPush()) return

  const media = await getMedia(imageId)

  if (!media?.blob) return

  return URL.createObjectURL(media.blob)
}

export const showBrowserPushWithImage = async (
  title: string,
  options: NotificationOptions,
  imageId: MediaId,
  getMedia: BrowserPushMediaGetter
) => {
  const imageUrl = await createBrowserPushImageUrl(imageId, getMedia)
  const notification = showBrowserPush(title, {
    ...options,
    ...(imageUrl && {
      icon: imageUrl,
      image: imageUrl
    })
  })

  if (!imageUrl) return

  if (!notification) {
    URL.revokeObjectURL(imageUrl)
    return
  }

  const releaseImageUrl = () => URL.revokeObjectURL(imageUrl)

  notification.addEventListener('click', releaseImageUrl, { once: true })
  notification.addEventListener('close', releaseImageUrl, { once: true })
  notification.addEventListener('error', releaseImageUrl, { once: true })
}
