import { DEFAULT_CUSTOM_SCHEMA } from 'src/shared/config/appearance.constants'

import { IColorSchema } from '../../config'

export const mergeCustomTheme = (customTheme: Partial<IColorSchema> = DEFAULT_CUSTOM_SCHEMA): IColorSchema => ({
  ...DEFAULT_CUSTOM_SCHEMA,
  ...customTheme
})
