import type { INmorphStaticColors } from '@nmorph/nmorph-ui-kit'

import type { KebabCase } from 'src/shared/lib'

export type AppHeaderTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5'

export type AppHeaderStaticColor = keyof Pick<
  INmorphStaticColors,
  'text' | 'semiContrastText' | 'contrastText' | 'accent' | 'warn'
>

export type AppHeaderColor = KebabCase<AppHeaderStaticColor>

export type AppHeaderAlignment = 'left' | 'center' | 'right'

export interface AppHeaderProps {
  text?: string | number
  tag?: AppHeaderTag
  accent?: boolean
  bold?: boolean
  color?: AppHeaderColor
  alignment?: AppHeaderAlignment
  truncate?: boolean
  selectable?: boolean
}
