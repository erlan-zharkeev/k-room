import { DEFAULT_CUSTOM_THEME } from '../../config/theme.constants'
import { ICustomThemeSetting } from '../../types/theme'

export const mergeCustomTheme = (
  customTheme: Partial<ICustomThemeSetting> = DEFAULT_CUSTOM_THEME
): ICustomThemeSetting => ({
  ...DEFAULT_CUSTOM_THEME,
  ...customTheme,
  text: {
    ...DEFAULT_CUSTOM_THEME.text,
    ...(typeof customTheme.text === 'object' ? customTheme.text : {})
  }
})
