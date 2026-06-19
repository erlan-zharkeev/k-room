import { computed } from 'vue'

import { useScreen } from 'src/shared/lib'

import type { ContentLayoutProps } from './types'

export const useContentLayout = (props: ContentLayoutProps) => {
  const { isPortraitTabletOrLess } = useScreen()
  const showHeader = computed(() => isPortraitTabletOrLess.value || Boolean(props.titleKey))

  return {
    isPortraitTabletOrLess,
    showHeader
  }
}
