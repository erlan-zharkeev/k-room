import type { BaseSizeModifierType } from 'src/shared/ui/config'

export interface IDotsAnimatedTextProps {
  text: string
  maxDots?: number
  interval?: number
  textSize?: BaseSizeModifierType
}
