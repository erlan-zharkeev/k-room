import type { AppHeaderProps } from './types'
import type { AppHeaderColor } from './types'

export const APP_HEADER_DEFAULT_PROPS = {
  tag: 'h3',
  accent: false,
  bold: true,
  alignment: 'left',
  selectable: true
} satisfies Partial<AppHeaderProps>

export const APP_HEADER_COLOR_MODIFIERS = {
  text: 'text',
  'semi-contrast-text': 'semi-contrast-text',
  'contrast-text': 'contrast-text',
  accent: 'accent',
  warn: 'warn'
} satisfies Record<AppHeaderColor, AppHeaderColor>
