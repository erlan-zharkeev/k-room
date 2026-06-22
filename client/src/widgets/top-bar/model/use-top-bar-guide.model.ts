import { computed } from 'vue'

import { useScreen } from 'src/shared/lib'

export const useTopBarGuide = () => {
  const { isPortraitTabletOrLess } = useScreen()

  const topBarGuidePosition = computed(() => (isPortraitTabletOrLess.value ? 'bottom' : 'right'))

  return {
    topBarGuidePosition
  }
}
