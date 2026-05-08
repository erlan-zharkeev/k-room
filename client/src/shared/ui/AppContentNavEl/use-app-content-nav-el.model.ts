import { computed } from 'vue'

import { useScreen } from 'src/shared/lib'

import type { IAppContentNavElProps } from './types'

export const useAppContentNavEl = (props: IAppContentNavElProps) => {
  const { isPortraitTabletOrLess } = useScreen()
  const showIcon = computed(() => !isPortraitTabletOrLess.value)
  const rootClass = computed(() => [
    'app-content-nav-el',
    props.active && showIcon.value ? 'nmorph--shadow-inset' : 'nmorph--shadow-outset'
  ])
  const buttonClass = computed(() => ['app-content-nav-el-btn', { 'app-content-nav-el-btn--active': props.active }])

  return {
    buttonClass,
    rootClass,
    showIcon
  }
}
