import type { LocalizedText, MediaFileValue } from 'global-shared'

export type ClientPlatform = 'browser' | 'native'

export type FileLoaderValue = MediaFileValue | MediaFileValue[] | string | null

export interface ImageToBase64Params {
  image: File
  allowedResolutions?: string[]
  t: <T>(texts: LocalizedText<T>) => T
  maxImageSizeInMb?: number
}

export interface ConsoleColor {
  bg: string
  text: string
}

export type ScreenBreakpointName = 'mobile' | 'portrait-tablet' | 'tablet' | 'desktop'

export type ScreenBreakpoints = Record<ScreenBreakpointName, number>
