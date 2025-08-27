import { MIN_SUPPORTED_HEIGHT, MIN_SUPPORTED_WIDTH, ViewPortWidthType } from '../config'

import { useSystem } from './use-system'

export const useViewport = () => {
  const { viewPort } = useSystem()
  const { width, height } = viewPort

  return {
    isPhone: width <= ViewPortWidthType.Phone,
    isTablet: width > ViewPortWidthType.Phone && width <= ViewPortWidthType.Tablet,
    isDesktop: width > ViewPortWidthType.Tablet,

    greaterThanPhone: width > ViewPortWidthType.Phone,
    greaterThanTablet: width > ViewPortWidthType.Tablet,
    greaterThanDesktop: width > ViewPortWidthType.Desktop,

    greaterOrEqualPhone: width >= ViewPortWidthType.Phone,
    greaterOrEqualTablet: width >= ViewPortWidthType.Tablet,
    greaterOrEqualDesktop: width >= ViewPortWidthType.Desktop,

    lessThanTablet: width < ViewPortWidthType.Tablet,
    lessThanDesktop: width < ViewPortWidthType.Desktop,

    lessOrEqualPhone: width <= ViewPortWidthType.Phone,
    lessOrEqualTablet: width <= ViewPortWidthType.Tablet,
    lessOrEqualDesktop: width <= ViewPortWidthType.Desktop,

    lessThenSupported: width <= MIN_SUPPORTED_WIDTH || height <= MIN_SUPPORTED_HEIGHT,

    viewPort
  }
}
