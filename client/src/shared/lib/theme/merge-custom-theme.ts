import { DEFAULT_CUSTOM_THEME } from 'src/shared/config/theme.constants'
import type { ICustomThemeSetting } from 'src/shared/types/theme'

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
