export type AppTextTagType = 'span' | 'p' | 'div'

export type AppTextColorType = 'text-color' | 'accent-color' | 'error-color' | 'warn-color'

export type AppTextSizeType = 'extra-small' | 'small' | 'medium' | 'large'

export type AppTextAlignType = 'left' | 'center' | 'right'

export interface IAppTextProps {
  tag?: AppTextTagType
  color?: AppTextColorType
  size?: AppTextSizeType
  align?: AppTextAlignType
}
