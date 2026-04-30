export type AppHeaderTagType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5'

export type AppHeaderColorType = 'text-color' | 'semi-contrast-color' | 'contrast-color' | 'accent-color' | 'warn-color'
export interface IAppHeaderProps {
  text?: string | number
  tag?: AppHeaderTagType
  accent?: boolean
  bold?: boolean
  color?: AppHeaderColorType
  truncate?: boolean
}
