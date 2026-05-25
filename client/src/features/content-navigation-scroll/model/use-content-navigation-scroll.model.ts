import type { INmorphScrollExpose } from '@nmorph/nmorph-ui-kit'
import { nextTick, onBeforeUnmount, onMounted, useTemplateRef } from 'vue'

import { useSettings, type ContentNavigationScrollState, type ContentNavigationScrollTab } from 'src/entities/setting'

export const useContentNavigationScroll = (tab: ContentNavigationScrollTab) => {
  const contentNavigationScrollRef = useTemplateRef<INmorphScrollExpose>('contentNavigationScroll')
  const { settings, setByPath } = useSettings()

  const saveContentNavigationScrollState = async (coords: ContentNavigationScrollState) => {
    const currentCoords = settings.value.contentNavigationScrollByTab[tab]
    const hasSameCoords = currentCoords.x === coords.x && currentCoords.y === coords.y

    if (hasSameCoords) return

    await setByPath(`contentNavigationScrollByTab.${tab}`, coords)
  }

  const restoreContentNavigationScrollState = () => {
    const scrollElement = contentNavigationScrollRef.value?.scrollDOMContainer

    if (!scrollElement) return

    const { x, y } = settings.value.contentNavigationScrollByTab[tab]

    scrollElement.scrollLeft = x
    scrollElement.scrollTop = y
  }

  const saveCurrentContentNavigationScrollState = () => {
    const scrollElement = contentNavigationScrollRef.value?.scrollDOMContainer

    if (!scrollElement) return

    void saveContentNavigationScrollState({
      x: Math.trunc(scrollElement.scrollLeft),
      y: Math.trunc(scrollElement.scrollTop)
    })
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
