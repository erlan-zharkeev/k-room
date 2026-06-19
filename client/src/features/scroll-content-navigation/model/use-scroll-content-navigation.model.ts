import type { INmorphScrollExpose, NmorphCoordsType } from '@nmorph/nmorph-ui-kit'
import { onBeforeUnmount, useTemplateRef, watch } from 'vue'

import { useSettings, type ScrollContentNavigationTab } from 'src/entities/setting'

export const useScrollContentNavigation = (tab: ScrollContentNavigationTab) => {
  const scrollContentNavigationRef = useTemplateRef<INmorphScrollExpose>('scrollContentNavigation')
  const { settings, setByPath } = useSettings()

  const saveScrollContentNavigationTop = async (scrollTop: number) => {
    const currentScrollTop = settings.value.scrollContentNavigationByTab[tab]
    const nextScrollTop = Math.trunc(scrollTop)
    const hasSameScrollTop = currentScrollTop === nextScrollTop

    if (hasSameScrollTop) return

    await setByPath(`scrollContentNavigationByTab.${tab}`, nextScrollTop)
  }

  const saveScrollContentNavigationState = ({ y }: NmorphCoordsType) => {
    void saveScrollContentNavigationTop(y)
  }

  const restoreScrollContentNavigationState = () => {
    const scrollElement = scrollContentNavigationRef.value?.scrollDOMContainer

    if (!scrollElement) return

    scrollElement.scrollTop = settings.value.scrollContentNavigationByTab[tab]
  }

  const saveCurrentScrollContentNavigationState = () => {
    const scrollElement = scrollContentNavigationRef.value?.scrollDOMContainer

    if (!scrollElement) return

    void saveScrollContentNavigationTop(scrollElement.scrollTop)
  }

  watch(() => scrollContentNavigationRef.value?.scrollDOMContainer, restoreScrollContentNavigationState, {
    flush: 'post',
    immediate: true
  })
  onBeforeUnmount(saveCurrentScrollContentNavigationState)

  return {
    saveScrollContentNavigationState
  }
}
