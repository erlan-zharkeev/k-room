import type { IAppTextProps } from './types'

export const APP_TEXT_DEFAULT_PROPS = {
  tag: 'span',
  color: 'text-color',
  align: 'left',
  bold: false
} satisfies Partial<IAppTextProps>
