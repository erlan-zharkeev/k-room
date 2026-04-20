import { ThemeType } from 'src/shared/config'
import { useSettings } from 'src/shared/preferences'

export const useThemeUpdate = () => {
  const settings = useSettings()

  const setThemeToDom = (value: ThemeType) => {
    const html = document.querySelector('html')
    html?.setAttribute('theme', value)
  }

  const updateThemeByName = (value: ThemeType) => {
    settings.shallowUpdate({ theme: value })
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
