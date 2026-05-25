import type { INmorphScrollExpose, NmorphCoordsType } from '@nmorph/nmorph-ui-kit'
import { nextTick, onBeforeUnmount, onMounted, useTemplateRef } from 'vue'

import { useSettings, type ContentNavigationScrollTab } from 'src/entities/setting'

export const useContentNavigationScroll = (tab: ContentNavigationScrollTab) => {
  const contentNavigationScrollRef = useTemplateRef<INmorphScrollExpose>('contentNavigationScroll')
  const { settings, setByPath } = useSettings()

  const saveContentNavigationScrollTop = async (scrollTop: number) => {
    const currentScrollTop = settings.value.contentNavigationScrollByTab[tab]
    const nextScrollTop = Math.trunc(scrollTop)
    const hasSameScrollTop = currentScrollTop === nextScrollTop

    if (hasSameScrollTop) return

    await setByPath(`contentNavigationScrollByTab.${tab}`, nextScrollTop)
  }

  const saveContentNavigationScrollState = ({ y }: NmorphCoordsType) => {
    void saveContentNavigationScrollTop(y)
  }

  const restoreContentNavigationScrollState = () => {
    const scrollElement = contentNavigationScrollRef.value?.scrollDOMContainer

    if (!scrollElement) return

    scrollElement.scrollTop = settings.value.contentNavigationScrollByTab[tab]
  }

  const saveCurrentContentNavigationScrollState = () => {
    const scrollElement = contentNavigationScrollRef.value?.scrollDOMContainer

    if (!scrollElement) return

    void saveContentNavigationScrollTop(scrollElement.scrollTop)
  }

  onMounted(async () => {
    await nextTick()

    restoreContentNavigationScrollState()
  })
  onBeforeUnmount(saveCurrentContentNavigationScrollState)

  return {
    saveContentNavigationScrollState
  }
}
