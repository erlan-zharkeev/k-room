import type { AppHeaderProps } from './types'

export const APP_HEADER_DEFAULT_PROPS = {
  tag: 'h3',
  accent: false,
  bold: true,
  alignment: 'left',
  selectable: true
} satisfies Partial<AppHeaderProps>
