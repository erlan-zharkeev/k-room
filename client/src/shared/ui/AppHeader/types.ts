export type AppHeaderTagType = 'h1' | 'h2' | 'h3' | 'h4'

export type AppHeaderColorType = 'text-color' | 'semi-contrast-color' | 'contrast-color' | 'accent-color' | 'warn-color'

export type AppHeaderSizeType = 'small' | 'medium' | 'large' | 'xlarge'

export interface IAppHeaderProps {
  text?: string | number
  tag?: AppHeaderTagType
  accent?: boolean
  bold?: boolean
  color?: AppHeaderColorType
  size?: AppHeaderSizeType
}
