import { BaseSizeModifier } from 'src/shared/ui/internals/types'

export interface DotsAnimatedTextProps {
  text: string
  maxDots?: number
  interval?: number
  textSize?: BaseSizeModifier
}
