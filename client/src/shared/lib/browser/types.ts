import type { LocalizedTextType, MediaFileValueType } from 'global-shared'

export type ClientPlatformType = 'browser' | 'native'

export type FileLoaderValueType = MediaFileValueType | MediaFileValueType[] | string | null

export interface IImageToBase64Params {
  image: File
  allowedResolutions?: string[]
  t: <T>(texts: LocalizedTextType<T>) => T
  maxImageSizeInMb?: number
}

export interface IConsoleColor {
  bg: string
  text: string
}
