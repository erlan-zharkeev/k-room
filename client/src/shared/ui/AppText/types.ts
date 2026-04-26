export type AppTextTagType = 'span' | 'p' | 'div'

export type AppTextColorType = 'text-color' | 'semi-contrast-color' | 'contrast-color' | 'accent-color' | 'warn-color'

export type AppTextSizeType = 'extra-small' | 'small' | 'medium' | 'large'

export type AppTextAlignType = 'left' | 'center' | 'right'

export interface IAppTextProps {
  text?: string | number
  tag?: AppTextTagType
  color?: AppTextColorType
  size?: AppTextSizeType
  align?: AppTextAlignType
  bold?: boolean
}
