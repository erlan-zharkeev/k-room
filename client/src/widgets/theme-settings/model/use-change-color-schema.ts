import { useSettings } from 'src/entities/setting'
import { IColorSchema } from 'src/shared/config'

export const useChangeColorSchema = () => {
  const { settings, setByPath } = useSettings()

  const changeThemeColor = (key: keyof IColorSchema, value: string) => {
    void setByPath(`appearance.themes.${settings.value.appearance.selectedTheme}.colorSchema.${key}`, value)
  }

  return {
    settings,
    changeThemeColor
  }
}
