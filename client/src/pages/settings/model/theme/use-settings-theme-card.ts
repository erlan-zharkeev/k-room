import { useSettings } from 'src/entities/setting'
import type { CustomThemeColorType } from 'src/shared/config'

export const useSettingsThemeCard = () => {
  const { settings, setByPath } = useSettings()

  const changeCustomThemeColor = (colorName: CustomThemeColorType, value: string) => {
    if (!value) return

    void setByPath(`customTheme.${colorName}`, value)
  }

  return {
    settings,
    changeCustomThemeColor
  }
}
