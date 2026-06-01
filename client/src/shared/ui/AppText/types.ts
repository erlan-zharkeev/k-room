import type { INmorphStaticColors } from '@nmorph/nmorph-ui-kit'

import type { KebabCase } from 'src/shared/lib'
import type { AppTypographyBaseProps } from 'src/shared/ui/types'

export type AppTextTag = 'span' | 'p' | 'div' | 'small'

export type AppTextStaticColor = keyof Pick<
  INmorphStaticColors,
  'text' | 'semiContrastText' | 'contrastText' | 'accent' | 'warn' | 'errorText'
>

export type AppTextColor = KebabCase<AppTextStaticColor>

export interface AppTextProps extends AppTypographyBaseProps {
  tag?: AppTextTag
  color?: AppTextColor
  italic?: boolean
  lineClamp?: number
  noLineHeight?: boolean
}
