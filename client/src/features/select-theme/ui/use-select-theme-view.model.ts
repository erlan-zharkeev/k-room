import { computed } from 'vue'

import { useScreen } from 'src/shared/lib'

import { useSelectTheme } from '../model/use-select-theme.model'

import type { SelectThemeProps } from './types'

export const useSelectThemeView = (props: SelectThemeProps) => {
  const { settings, changeTheme } = useSelectTheme()
  const { isPortraitTabletOrLess } = useScreen()
  const themeIconWidth = computed(() => (props.compact || !isPortraitTabletOrLess.value ? '16px' : '24px'))

  return {
    settings,
    changeTheme,
    isPortraitTabletOrLess,
    themeIconWidth
  }
}
