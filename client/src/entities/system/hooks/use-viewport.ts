import { useTypedSelector } from 'src/shared/lib'

export enum ViewPortWidthType {
  Desktop = 1200,
  Tablet = 769,
  Phone = 576
}

export const useViewport = () => {
  const width = useTypedSelector((state) => state.system.viewPort.width)

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

    lessOrEqualTablet: width <= ViewPortWidthType.Tablet,
    lessOrEqualDesktop: width <= ViewPortWidthType.Desktop
  }
}
