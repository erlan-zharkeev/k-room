import { useBreakpoints } from '@vueuse/core'

import { SCREEN_BREAKPOINTS } from 'src/shared/config'

export const useScreen = () => {
  const breakpoints = useBreakpoints(SCREEN_BREAKPOINTS)

  return {
    activeBreakpoint: breakpoints.active(),
    isPortraitTablet: breakpoints.between('portrait-tablet', 'tablet'),
    isTablet: breakpoints.smaller('tablet'),
    isDesktop: breakpoints.greaterOrEqual('desktop')
  }
}
