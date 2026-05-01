import { useSettings } from 'src/entities/setting'
import type { ThemeType } from 'src/shared/config'

export const useThemeSelect = () => {
  const { settings, setByPath } = useSettings()

  const changeTheme = (value: ThemeType) => {
    if (value === settings.value.appearance.selectedTheme) return

    void setByPath('appearance.selectedTheme', value)
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
