import type { IAppTextProps } from './types'

export const APP_TEXT_DEFAULT_PROPS = {
  tag: 'span',
  color: 'text-color',
  size: 'medium',
  align: 'left',
  bold: false
} satisfies Partial<IAppTextProps>
