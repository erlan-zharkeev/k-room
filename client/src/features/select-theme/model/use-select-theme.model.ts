import { useSettings } from 'src/entities/setting'
import type { Theme } from 'src/entities/setting'

import { SELECT_THEME_OPTIONS } from '../config/constants'

export const useSelectTheme = () => {
  const { settings, setByPath } = useSettings()

  const changeTheme = (value: string) => {
    const option = SELECT_THEME_OPTIONS.find((item) => item.value === value)

    if (!option || option.value === settings.value.appearance.selectedTheme) return

    void setByPath('appearance.selectedTheme', option.value)
  }

  const changeSystemTheme = (value: Theme) => {
    void setByPath('appearance.systemTheme', value)
  }

  return {
    settings,
    changeTheme,
    changeSystemTheme
  }
}
