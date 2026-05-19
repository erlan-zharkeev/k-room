import { computed } from 'vue'

import { useScreen } from 'src/shared/lib'

import type { ISettingsNavigationItemProps } from './types'

export const useSettingsNavigationItem = (props: ISettingsNavigationItemProps) => {
  const { isPortraitTabletOrLess } = useScreen()
  const showIcon = computed(() => !isPortraitTabletOrLess.value)
  const buttonClass = computed(() => [
    'settings-navigation-item-btn',
    { 'settings-navigation-item-btn--active': props.active }
  ])

  return {
    buttonClass,
    showIcon
  }
}
