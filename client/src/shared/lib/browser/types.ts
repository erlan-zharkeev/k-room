import type { ImageObject } from 'global-shared'

import type { I18nTranslate } from '../i18n/i18n.types'

export type ClientPlatform = 'browser' | 'native'

export type FileLoaderValue = ImageObject | ImageObject[] | string | null

export interface ImageToBase64Params {
  image: File
  allowedResolutions?: string[]
  t: I18nTranslate
  maxImageSizeInMb?: number
}

export interface ConsoleColor {
  bg: string
  text: string
}

export type ScreenBreakpointName = 'mobile' | 'portrait-tablet' | 'tablet' | 'desktop'

export type ScreenBreakpoints = Record<ScreenBreakpointName, number>
