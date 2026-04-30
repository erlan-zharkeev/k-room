export type AppTextTagType = 'span' | 'p' | 'div' | 'small'

export type AppTextColorType = 'text-color' | 'semi-contrast-color' | 'contrast-color' | 'accent-color' | 'warn-color'

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
