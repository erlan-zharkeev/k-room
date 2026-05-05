import type { INmorphStaticColors } from '@nmorph/nmorph-ui-kit'

import type { KebabCaseType } from 'src/shared/types'

export type AppTextTagType = 'span' | 'p' | 'div' | 'small'

export type AppTextStaticColorType = keyof Pick<
  INmorphStaticColors,
  'text' | 'semiContrastText' | 'contrastText' | 'accent' | 'warn' | 'errorText'
>

export type AppTextColorType = KebabCaseType<AppTextStaticColorType>

export type AppTextAlignType = 'left' | 'center' | 'right'

export interface IAppTextProps {
  text?: string | number
  tag?: AppTextTagType
  color?: AppTextColorType
  align?: AppTextAlignType
  bold?: boolean
  truncate?: boolean
  noLineHeight?: boolean
}
