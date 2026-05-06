import { useBreakpoints } from '@vueuse/core'

import { SCREEN_BREAKPOINTS } from 'src/shared/config'

export const useScreen = () => {
  const breakpoints = useBreakpoints(SCREEN_BREAKPOINTS)

  return {
    activeBreakpoint: breakpoints.active(),
    isPortraitTabletOnly: breakpoints.between('portrait-tablet', 'tablet'),
    isPortraitTabletOrLess: breakpoints.smaller('tablet'),
    isDesktopOrMore: breakpoints.greaterOrEqual('desktop')
  }
}
