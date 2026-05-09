import { useSettings } from 'src/entities/setting'
import type { ThemeType } from 'src/entities/setting'

import { THEME_SELECT_OPTIONS } from '../config/constants'

export const useThemeSelect = () => {
  const { settings, setByPath } = useSettings()

  const changeTheme = (value: string) => {
    const option = THEME_SELECT_OPTIONS.find((item) => item.value === value)

    if (!option || option.value === settings.value.appearance.selectedTheme) return

    void setByPath('appearance.selectedTheme', option.value)
  }

  const changeSystemTheme = (value: ThemeType) => {
    void setByPath('appearance.systemTheme', value)
  }

  return {
    settings,
    changeTheme,
    changeSystemTheme
  }
}
