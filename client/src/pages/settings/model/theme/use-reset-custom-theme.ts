import { useSettings } from 'src/entities/setting'
import { DEFAULT_CUSTOM_SCHEMA } from 'src/shared/config'

export const useResetCustomTheme = () => {
  const { isSelectedThemeCustom, setByPath } = useSettings()

  const resetCustomTheme = () => {
    void setByPath('appearance.themes.custom.colorSchema', { ...DEFAULT_CUSTOM_SCHEMA })
  }

  return {
    isSelectedThemeCustom,
    resetCustomTheme
  }
}
