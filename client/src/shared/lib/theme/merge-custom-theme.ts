import type { ICustomThemeSetting } from 'src/shared/types/theme'

import { DEFAULT_CUSTOM_SCHEMA } from 'src/shared/config/appearance.constants'

export const mergeCustomTheme = (
  customTheme: Partial<ICustomThemeSetting> = DEFAULT_CUSTOM_SCHEMA
): ICustomThemeSetting => ({
  ...DEFAULT_CUSTOM_SCHEMA,
  ...customTheme,
  text: {
    ...DEFAULT_CUSTOM_SCHEMA.text,
    ...(typeof customTheme.text === 'object' ? customTheme.text : {})
  }
})
