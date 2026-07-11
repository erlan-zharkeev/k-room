import type { AppearanceSettings, ThemeData } from 'src/entities/setting'

import { THEME_BOOTSTRAP_STORAGE_KEY, THEME_BOOTSTRAP_VERSION } from './constants'

const createThemeColors = ({ mode, colorSchema }: ThemeData) => ({
  mode,
  main: colorSchema.main,
  accent: colorSchema.accent
})

export const syncThemeBootstrapCache = (appearance: AppearanceSettings, activeTheme: ThemeData) => {
  const { selectedTheme, themes } = appearance
  const snapshot = {
    version: THEME_BOOTSTRAP_VERSION,
    selectedTheme,
    themes: {
      dark: createThemeColors(themes.dark),
      light: createThemeColors(themes.light),
      custom: createThemeColors(themes.custom)
    }
  }

  try {
    localStorage.setItem(THEME_BOOTSTRAP_STORAGE_KEY, JSON.stringify(snapshot))
  } catch {
    // The active theme still applies when browser storage is unavailable.
  }

  const { main, accent } = activeTheme.colorSchema
  const rootStyle = document.documentElement.style
  const themeColorMeta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')

  rootStyle.setProperty('--app-bootstrap-theme-bg', main)
  rootStyle.setProperty('--app-bootstrap-theme-accent', accent)
  themeColorMeta?.setAttribute('content', main)
}
