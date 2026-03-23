import type { BaseSizeModifier } from '../../config'

export interface IDotsAnimatedTextProps {
  text: string
  maxDots?: number
  interval?: number
  textSize?: BaseSizeModifier
}
