import type { AppTextProps } from './types'
import type { AppTextColor } from './types'

export const APP_TEXT_DEFAULT_PROPS = {
  tag: 'span',
  color: 'text',
  alignment: 'left',
  bold: false,
  selectable: true
} satisfies Partial<AppTextProps>

export const APP_TEXT_COLOR_MODIFIERS = {
  text: 'text',
  'semi-contrast-text': 'semi-contrast-text',
  'contrast-text': 'contrast-text',
  accent: 'accent',
  warn: 'warn',
  'error-text': 'error-text'
} satisfies Record<AppTextColor, AppTextColor>
