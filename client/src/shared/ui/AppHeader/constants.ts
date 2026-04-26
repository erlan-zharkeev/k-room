import type { IAppHeaderProps } from './types'

export const APP_HEADER_DEFAULT_PROPS = {
  tag: 'h3',
  accent: false,
  bold: true
} satisfies Partial<IAppHeaderProps>
