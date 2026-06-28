import { useBreakpoints } from '@vueuse/core'
import { isString, MB_IN_BYTES } from 'global-shared'

import { BROWSER_PUSH_FALLBACK_ICON, CONSOLE_COLOR_MAP, GB, IMAGE_RESOLUTIONS, SCREEN_BREAKPOINTS } from './constants'
import { BROWSER_I18N } from './i18n'
import type { ClientPlatform } from './types'
import type { ImageToBase64Params } from './types'

export const getClientPlatform = (): ClientPlatform => {
  return '__TAURI_INTERNALS__' in window ? 'native' : 'browser'
}

export const getDataUrlMimeType = (url: string) => url.match(/^data:([^;]+);/)?.[1] ?? ''

export const getViewPort = () => {
  const { innerWidth: width, innerHeight: height } = window

  return {
    width,
    height
  }
}

export const imageToBase64 = ({
  image,
  allowedResolutions = Object.values(IMAGE_RESOLUTIONS),
  t,
  maxImageSizeInMb = 5
}: ImageToBase64Params) => {
  const reader = new FileReader()
  const warnings = []
  const resolutionNotAllowed = !allowedResolutions.includes(image.type)

  reader.readAsDataURL(image)

  if (resolutionNotAllowed) warnings.push(t(BROWSER_I18N.imageFormatNotAllowed))

  const isGreaterThanAllowed = image.size / MB_IN_BYTES > maxImageSizeInMb

  if (isGreaterThanAllowed) {
    warnings.push(t(BROWSER_I18N.imageSizeMustBeLess, { size: maxImageSizeInMb }))
  }

  if (warnings.length) return

  return reader
}

export const isEmptyFileWithName = (file: File, name: string) => file.size === 0 && file.name === name

export const readFileAsDataUrl = (file: File) =>
  new Promise<string | undefined>((resolve) => {
    const reader = new FileReader()

    reader.addEventListener('load', () => resolve(isString(reader.result) ? reader.result : undefined))
    reader.addEventListener('error', () => resolve(undefined))
    reader.readAsDataURL(file)
  })

export const canShowBrowserPush = () => 'Notification' in window && Notification.permission === 'granted'

export const showBrowserPush = (title: string, options?: NotificationOptions) => {
  if (!canShowBrowserPush()) return

  try {
    const notification = new Notification(title, {
      icon: BROWSER_PUSH_FALLBACK_ICON,
      ...options
    })

    return notification
  } catch (error) {
    void error
  }
}

export const revokeObjectUrl = (url?: string) => {
  if (!url) return

  URL.revokeObjectURL(url)
}

export const revokeObjectUrls = (urls: Iterable<string | undefined>) => {
  Array.from(urls).forEach(revokeObjectUrl)
}

export const formatBytes = (bytes: number): string => {
  if (bytes >= GB) {
    return `${(bytes / GB).toFixed(2)} GB`
  }

  return `${Math.round(bytes / MB_IN_BYTES)} MB`
}

export const useScreen = () => {
  const breakpoints = useBreakpoints(SCREEN_BREAKPOINTS)

  return {
    activeBreakpoint: breakpoints.active(),
    isMobileOnly: breakpoints.smaller('portrait-tablet'),
    isPortraitTabletOnly: breakpoints.between('portrait-tablet', 'tablet'),
    isPortraitTabletOrLess: breakpoints.smaller('tablet'),
    isDesktopOrMore: breakpoints.greaterOrEqual('desktop')
  }
}

export const clearCookie = () => {
  document.cookie.split(';').forEach((cookie) => {
    document.cookie = cookie.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/')
  })
}

export const log = (type: 'error' | 'success' | 'warn', message: string, error?: unknown) => {
  console.log(
    `%c ${message} `,
    `background: ${CONSOLE_COLOR_MAP[type].bg}; color: ${CONSOLE_COLOR_MAP[type].text}`,
    ...(error !== undefined ? [error] : [])
  )
}
