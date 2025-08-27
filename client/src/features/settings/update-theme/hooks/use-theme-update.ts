import { useSettings } from 'src/entities/settings'

import type { ThemeType } from 'src/shared/config'

export const useThemeUpdate = () => {
  const settings = useSettings()

  const setThemeToDom = (value: ThemeType) => {
    const html = document.querySelector('html')
    html?.setAttribute('theme', value)
  }

  const updateThemeByName = (value: ThemeType) => {
    settings.update({ theme: value })
    setThemeToDom(value)
  }

  const toggleTheme = (value: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = value.target
    const newTheme = checked ? 'dark' : 'light'
    updateThemeByName(newTheme)
  }

  return {
    toggleTheme,
    updateThemeByName,
    setThemeToDom
  }
}
