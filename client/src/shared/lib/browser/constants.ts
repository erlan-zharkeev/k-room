import { MEDIA_MB_IN_BYTES } from 'global-shared'

import type { IConsoleColor, ScreenBreakpointsType } from './types'

export const IMAGE_RESOLUTIONS = {
  png: 'image/png',
  jpeg: 'image/jpeg',
  jpg: 'image/jpg'
} as const

export const GB = MEDIA_MB_IN_BYTES * 1024

export const CONSOLE_COLOR_MAP: Record<string, IConsoleColor> = {
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

export const SCREEN_BREAKPOINTS = {
  mobile: 320,
  'portrait-tablet': 768,
  tablet: 1024,
  desktop: 1920
} satisfies ScreenBreakpointsType
