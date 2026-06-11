import { AUTH_LAYOUT_CSS_HEX_COLOR_RADIX, AUTH_LAYOUT_NET_EFFECT_COLOR_CSS_VARIABLE } from './constants'

export const resolveAuthLayoutNetEffectColor = (element: HTMLElement) => {
  const color = getComputedStyle(element).getPropertyValue(AUTH_LAYOUT_NET_EFFECT_COLOR_CSS_VARIABLE).trim()

  return Number.parseInt(color.replace('#', ''), AUTH_LAYOUT_CSS_HEX_COLOR_RADIX)
}
