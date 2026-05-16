import type { IAppTextProps } from './types'
import type { AppTextColorType } from './types'

export const APP_TEXT_DEFAULT_PROPS = {
  tag: 'span',
  color: 'text',
  align: 'left',
  bold: false,
  selectable: true
} satisfies Partial<IAppTextProps>

export const APP_TEXT_COLOR_MODIFIERS = {
  text: 'text',
  'semi-contrast-text': 'semi-contrast-text',
  'contrast-text': 'contrast-text',
  accent: 'accent',
  warn: 'warn',
  'error-text': 'error-text'
} satisfies Record<AppTextColorType, AppTextColorType>
