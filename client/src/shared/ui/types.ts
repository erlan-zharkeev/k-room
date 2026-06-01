export type AppTypographyAlignment = 'left' | 'center' | 'right'

export interface AppTypographyBaseProps {
  text?: string | number
  alignment?: AppTypographyAlignment
  bold?: boolean
  truncate?: boolean
  selectable?: boolean
}
