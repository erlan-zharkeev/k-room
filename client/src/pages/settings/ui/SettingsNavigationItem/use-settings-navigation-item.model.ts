import { computed } from 'vue'

import { useScreen } from 'src/shared/lib'

import type { SettingsNavigationItemProps } from './types'

export const useSettingsNavigationItem = (props: SettingsNavigationItemProps) => {
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
