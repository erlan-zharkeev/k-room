import type { AppTextProps } from './types'

export const APP_TEXT_DEFAULT_PROPS = {
  tag: 'span',
  color: 'text',
  alignment: 'left',
  bold: false,
  selectable: true
} satisfies Partial<AppTextProps>
