import type { LocalizedTextType } from 'global-shared'

export interface IImageToBase64Params {
  image: File
  allowedResolutions?: string[]
  t: <T>(texts: LocalizedTextType<T>) => T
  maxImageSizeInMb?: number
}
