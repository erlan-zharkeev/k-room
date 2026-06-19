import { useWindowSize } from '@vueuse/core'
import { computed } from 'vue'

import { MIN_APP_VIEWPORT_HEIGHT_PX, MIN_APP_VIEWPORT_WIDTH_PX } from '../config/constants'

export const useUnsupportedResolutionGuard = () => {
  const { height, width } = useWindowSize()
  const isUnsupportedResolution = computed(
    () => width.value < MIN_APP_VIEWPORT_WIDTH_PX || height.value < MIN_APP_VIEWPORT_HEIGHT_PX
  )

  return {
    isUnsupportedResolution
  }
}
