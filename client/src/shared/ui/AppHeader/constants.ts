import type { IAppHeaderProps } from './types'
import type { AppHeaderColorType } from './types'

export const APP_HEADER_DEFAULT_PROPS = {
  tag: 'h3',
  accent: false,
  bold: true,
  selectable: true
} satisfies Partial<IAppHeaderProps>

export const APP_HEADER_COLOR_MODIFIERS = {
  text: 'text',
  'semi-contrast-text': 'semi-contrast-text',
  'contrast-text': 'contrast-text',
  accent: 'accent',
  warn: 'warn'
} satisfies Record<AppHeaderColorType, AppHeaderColorType>
