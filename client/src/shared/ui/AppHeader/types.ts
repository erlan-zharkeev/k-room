import type { INmorphStaticColors } from '@nmorph/nmorph-ui-kit'

import type { KebabCaseType } from 'src/shared/lib'

export type AppHeaderTagType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5'

export type AppHeaderStaticColorType = keyof Pick<
  INmorphStaticColors,
  'text' | 'semiContrastText' | 'contrastText' | 'accent' | 'warn'
>

export type AppHeaderColorType = KebabCaseType<AppHeaderStaticColorType>

export interface IAppHeaderProps {
  text?: string | number
  tag?: AppHeaderTagType
  accent?: boolean
  bold?: boolean
  color?: AppHeaderColorType
  truncate?: boolean
  selectable?: boolean
}
