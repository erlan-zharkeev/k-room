import { BaseSizeModifierType } from 'src/shared/ui/internals/types'

export interface IDotsAnimatedTextProps {
  text: string
  maxDots?: number
  interval?: number
  textSize?: BaseSizeModifierType
}
