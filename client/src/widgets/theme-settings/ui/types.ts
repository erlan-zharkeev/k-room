import type { CustomThemeColorType, ICustomThemeSetting, ThemeType } from 'src/shared/config'

export interface IThemeSettingsProps {
  theme: ThemeType
  customTheme: ICustomThemeSetting
}

export interface IThemeSettingsEmits {
  changeCustomThemeColor: [colorName: CustomThemeColorType, value: string]
}
