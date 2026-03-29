import { useSystem } from '..'
import { MIN_SUPPORTED_HEIGHT, MIN_SUPPORTED_WIDTH, VIEW_PORT_WIDTH } from '../config'

export const useViewport = () => {
  const { viewPort } = useSystem()
  const { width, height } = viewPort

  return {
    isPhone: width <= VIEW_PORT_WIDTH.Phone,
    isTablet: width > VIEW_PORT_WIDTH.Phone && width <= VIEW_PORT_WIDTH.Tablet,
    isDesktop: width > VIEW_PORT_WIDTH.Tablet,

    greaterThanPhone: width > VIEW_PORT_WIDTH.Phone,
    greaterThanTablet: width > VIEW_PORT_WIDTH.Tablet,
    greaterThanDesktop: width > VIEW_PORT_WIDTH.Desktop,

    greaterOrEqualPhone: width >= VIEW_PORT_WIDTH.Phone,
    greaterOrEqualTablet: width >= VIEW_PORT_WIDTH.Tablet,
    greaterOrEqualDesktop: width >= VIEW_PORT_WIDTH.Desktop,

    lessThanTablet: width < VIEW_PORT_WIDTH.Tablet,
    lessThanDesktop: width < VIEW_PORT_WIDTH.Desktop,

    lessOrEqualPhone: width <= VIEW_PORT_WIDTH.Phone,
    lessOrEqualTablet: width <= VIEW_PORT_WIDTH.Tablet,
    lessOrEqualDesktop: width <= VIEW_PORT_WIDTH.Desktop,

    lessThenSupported: width <= MIN_SUPPORTED_WIDTH || height <= MIN_SUPPORTED_HEIGHT,

    viewPort
  }
}
