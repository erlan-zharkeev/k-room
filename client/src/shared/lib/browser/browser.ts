import { useBreakpoints } from '@vueuse/core'
import { MEDIA_MB_IN_BYTES } from 'global-shared'
import { isString } from 'lodash'

import { SCREEN_BREAKPOINTS } from 'src/shared/config'

import { CONSOLE_COLOR_MAP, IMAGE_RESOLUTIONS } from './constants'
import type { ClientPlatformType } from './types'
import type { IImageToBase64Params } from './types'

const GB = MEDIA_MB_IN_BYTES * 1024

export const getClientPlatform = (): ClientPlatformType => {
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
}: IImageToBase64Params) => {
  const reader = new FileReader()
  const warnings = []
  const resolutionNotAllowed = !allowedResolutions.includes(image.type)

  reader.readAsDataURL(image)

  if (resolutionNotAllowed)
    warnings.push(t({ ru: 'Недопустимый формат изображения', en: 'Image format is not allowed', zh: '图片格式不允许' }))

  const isGreaterThanAllowed = image.size / 1024 / 1024 > maxImageSizeInMb

  if (isGreaterThanAllowed) {
    warnings.push(
      t({
        ru: `Размер изображения должен быть меньше ${maxImageSizeInMb} МБ`,
        en: `Image size must be less than ${maxImageSizeInMb} MB`,
        zh: `图片大小必须小于 ${maxImageSizeInMb} MB`
      })
    )
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

export const formatBytes = (bytes: number): string => {
  if (bytes >= GB) {
    return `${(bytes / GB).toFixed(2)} GB`
  }

  return `${Math.round(bytes / MEDIA_MB_IN_BYTES)} MB`
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
