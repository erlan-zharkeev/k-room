import type { ThemeType } from 'src/shared/types/theme'

export const isThemeType = (theme: unknown): theme is ThemeType =>
  theme === 'light' || theme === 'custom' || theme === 'dark' || theme === 'system'
