import { ThemeType, useSettings } from 'src/entities/settings'

export const useThemeUpdate = () => {
  const { updateSetting } = useSettings()

  const setThemeToDom = (value: ThemeType) => {
    const html = document.querySelector('html')
    html?.setAttribute('theme', value)
  }

  const updateThemeByName = (value: ThemeType) => {
    updateSetting({ theme: value })
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
