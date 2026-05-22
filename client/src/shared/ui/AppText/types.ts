import type { INmorphStaticColors } from '@nmorph/nmorph-ui-kit'

import type { KebabCase } from 'src/shared/lib'

export type AppTextTag = 'span' | 'p' | 'div' | 'small'

export type AppTextStaticColor = keyof Pick<
  INmorphStaticColors,
  'text' | 'semiContrastText' | 'contrastText' | 'accent' | 'warn' | 'errorText'
>

export type AppTextColor = KebabCase<AppTextStaticColor>

export type AppTextAlignment = 'left' | 'center' | 'right'

export interface AppTextProps {
  text?: string | number
  tag?: AppTextTag
  color?: AppTextColor
  alignment?: AppTextAlignment
  bold?: boolean
  truncate?: boolean
  noLineHeight?: boolean
  selectable?: boolean
}
