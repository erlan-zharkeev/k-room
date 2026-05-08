import { MEDIA_MB_IN_BYTES } from 'global-shared'

export const IMAGE_RESOLUTIONS = {
  png: 'image/png',
  jpeg: 'image/jpeg',
  jpg: 'image/jpg'
} as const

export const GB = MEDIA_MB_IN_BYTES * 1024

export const CONSOLE_COLOR_MAP: Record<
  string,
  {
    bg: string
    text: string
  }
> = {
  error: {
    bg: '#000000',
    text: 'red'
  },
  success: {
    bg: '#000000',
    text: 'green'
  },
  warn: {
    bg: '#000000',
    text: 'orange'
  }
}
