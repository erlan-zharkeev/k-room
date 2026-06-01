import type { INmorphStaticColors } from '@nmorph/nmorph-ui-kit'

import type { KebabCase } from 'src/shared/lib'
import type { AppTypographyBaseProps } from 'src/shared/ui/types'

export type AppHeaderTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5'

export type AppHeaderStaticColor = keyof Pick<
  INmorphStaticColors,
  'text' | 'semiContrastText' | 'contrastText' | 'accent' | 'warn'
>

export type AppHeaderColor = KebabCase<AppHeaderStaticColor>

export interface AppHeaderProps extends AppTypographyBaseProps {
  tag?: AppHeaderTag
  accent?: boolean
  color?: AppHeaderColor
}
