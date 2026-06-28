import { MB_IN_BYTES } from 'global-shared'

import type { ConsoleColor, ScreenBreakpoints } from './types'

export const GB = MB_IN_BYTES * 1_024
export const BROWSER_PUSH_FALLBACK_ICON = '/meta/android-chrome-192x192.png'

export const IMAGE_RESOLUTIONS = {
  png: 'image/png',
  jpeg: 'image/jpeg',
  jpg: 'image/jpg'
} as const

export const CONSOLE_COLOR_MAP: Record<string, ConsoleColor> = {
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
  tablet: 1_024,
  desktop: 1_920
} satisfies ScreenBreakpoints
