import { useBreakpoints } from '@vueuse/core'

import { SCREEN_BREAKPOINTS } from 'src/shared/config'

export const useScreen = () => {
  const breakpoints = useBreakpoints(SCREEN_BREAKPOINTS)

  return {
    activeBreakpoint: breakpoints.active(),
    isMobile: breakpoints.smaller('portrait-tablet'),
    isPortraitTablet: breakpoints.between('portrait-tablet', 'tablet'),
    isTablet: breakpoints.between('tablet', 'desktop'),
    isDesktop: breakpoints.greaterOrEqual('desktop')
  }
}
