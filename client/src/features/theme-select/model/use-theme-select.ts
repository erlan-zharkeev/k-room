import { useSettings } from 'src/entities/setting'
import type { ThemeType } from 'src/shared/config'

export const useThemeSelect = () => {
  const { settings, shallowUpdate } = useSettings()

  const changeTheme = (value: ThemeType) => {
    if (value === settings.value.theme) return

    void shallowUpdate({ theme: value })
  }

  return {
    settings,
    changeTheme
  }
}
