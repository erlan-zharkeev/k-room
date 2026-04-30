import { computed } from 'vue'

import { useSettings } from 'src/entities/setting'
import type { CustomThemeColorType, ThemeType } from 'src/shared/config'

export const useSettingsThemeCard = () => {
  const { settings, theme, setByPath, shallowUpdate } = useSettings()
  const customTheme = computed(() => settings.value.customTheme)

  const changeTheme = (value: ThemeType) => {
    if (value === theme.value) return

    void shallowUpdate({ theme: value })
  }

  const changeCustomThemeColor = (colorName: CustomThemeColorType, value: string) => {
    if (!value) return

    void setByPath(`customTheme.${colorName}`, value)
  }

  return {
    theme,
    customTheme,
    changeTheme,
    changeCustomThemeColor
  }
}
