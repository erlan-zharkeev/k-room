import { computed } from 'vue'

import { useScreen } from 'src/shared/lib'

import type { IAppContentNavElProps } from './types'

export const useAppContentNavEl = (props: IAppContentNavElProps) => {
  const { isPortraitTabletOrLess } = useScreen()
  const showIcon = computed(() => !isPortraitTabletOrLess.value)
  const buttonClass = computed(() => ['app-content-nav-el-btn', { 'app-content-nav-el-btn--active': props.active }])

  return {
    buttonClass,
    showIcon
  }
}
